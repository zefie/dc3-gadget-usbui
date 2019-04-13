var ngui = require('nw.gui');
var nwin = ngui.Window.get();
nwin.enterFullscreen();
//nwin.showDevTools();
var fs = require('fs');
var path = require("path");
const { execSync, exec } = require('child_process');
var express = require('express');
var php = require("node-php"); 
var path = require("path"); 

var express_port = 9090;
var usbroot = path.normalize(process.cwd()+'/../');
var usbctrl = path.normalize(usbroot+'/ctrl/');
var usbimg = path.normalize(usbroot+'/images/');
var usbui = path.normalize(usbroot+'/ui/');
var external_sd = '/dev/mmcblk1';
var cmtmp = '/tmp/currentmode.zef'; // use tmp because its in ram
var staticip = '192.168.57.3/27';
var currentmenu = null;
var currentmode = 'Disabled';
var app = null;
var current_http = null;
var bool = {'true': new Boolean(true), 'false': new Boolean(false) };

function fa(fa_style) {
    return "<i class=\"fas fa-"+fa_style+"\"></i>";
}


function enableButtons(enabled) {
    var gray = 100;
    if (enabled) gray = 0;
    $('.zefmenu').prop('disabled', !enabled).css({"filter": "grayscale("+gray+"%)"});
    $("#reload").prop('disabled', false).css({"filter": "grayscale(0%)"})
}

function reloadApp() {
    $.cookie('currentmenu', currentmenu);
    enableButtons(false);
    location.reload();
}

function loadsite(webapp, index = '') {
    enableButtons(false);
    mdiv = document.getElementById('wrapper');
    $(mdiv).hide();
    mdiv = document.getElementById('webframe');
    app = express();
    app.use("/", php.cgi(usbui+'/apps/'+webapp)); 
    current_http = app.listen(express_port);
    
    $(mdiv).attr('src',"http://localhost:"+express_port+'/'+index);
    $(mdiv).show();
}

function execmd(ecmd) {
    enableButtons(false);
    execSync(usbui+'xterm-exec.sh '+ecmd);
    enableButtons(true);
}

function closeweb() {
    nwalert('Are you sure you want to close this web service?','Confirm','Yes', function() {
            mdiv = document.getElementById('webframe');
            $(mdiv).attr('src','');
            $(mdiv).hide();
            if (current_http !== null) {
                current_http.close(function() {
                    current_http = null;
                    app = null;
                });
            }
            mdiv = document.getElementById('wrapper');
            enableButtons(true);
            $(mdiv).show();
        }, 'No');
}

function nwalert(content, title = 'Notice', btn1text = 'Okay', clickfunc = null, btn2text = null, clickfunc2 = null) {
    var btn1css;

    if (btn1text == '') btn1css = "hidecss";
    else btn1css = "showcss";

    if (btn2text == null) btn2css = "hidecss";
    else btn2css = "showcss";

    $("#lblMessage").html(content);

    $("#dialog").dialog({
        resizable: false,
        title: title,
        modal: true,
        width: '300px',
        height: 'auto',
        bgiframe: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        buttons: [
            { text: btn1text, "class": btn1css, click: function () {
                $("#dialog").dialog('close');
                if (clickfunc instanceof Boolean) enableButtons(clickfunc);
                if (clickfunc instanceof Function) clickfunc();
              }
            }, { 
              text: btn2text, "class": btn2css, click: function () {
                $("#dialog").dialog('close');
                if (clickfunc2 instanceof Boolean) enableButtons(clickfunc2);
                if (clickfunc2 instanceof Function) clickfunc2();
              }
            }
        ]
    });
}

function sd2flash(imgfile) {
    enableButtons(false);
    if (imgfile == '/dev/mmcblk1.img') {
        nwalert("You can't flash the SD card to itself ;)",'Error');
        return false;
    }
    nwalert('Are you sure you want to overwrite the contents of the SD Card in Slot 2 with '+imgfile+'?','Confirm Overwrite','Yes', function() {
        nwalert('Are you <strong>absolutely</strong> sure you want to destroy the contents of the SD Card in Slot 2?','Confirm Overwrite','No', bool.true, 'Yes', function() {
            $(mdiv).html('<strong>Please wait... processing...</strong>');            
            exec(usbctrl+'/flash-sd2 '+imgfile, function (error, stdout) {
                enableButtons(true);
                if (error) {
                    nwalert(error,'Error','Okay', function() {
                        updateCurrentMode(currentmode);
                    });
                    return;
                }
                nwalert("Image written to SD2.",'Complete','Okay', function() {
                    updateCurrentMode(currentmode);
                });
            });
        });
    }, 'No', bool.true);
    
}

function servicetoggle(service) {
    enableButtons(false);
    mdiv = document.getElementById('mode');
    exec(usbctrl+'/service-status '+service, function (error, stdout) {
        if (error) {
            nwalert(error,'Error','Okay', function() {
                updateCurrentMode(currentmode);
            });
            return;
        }
        if (parseInt(stdout) > 0) msg = "STOP";
        else msg = "START";
        nwalert('Are you sure you want to <strong>'+msg+'</strong> the following service?<br><br><span font-size="normal">'+service+'</span>','Confirm','Yes', function() {
            $(mdiv).html('<strong>Please wait... processing '+service+'</strong>');
            exec(usbctrl+'/service-toggle '+service, function (error, stdout) {
                enableButtons(true);
                if (error) {
                    nwalert(error,'Error','Okay', function() {
                        updateCurrentMode(currentmode);
                    });
                    return;
                }
                nwalert(stdout,'Status','Okay', function() {
                    updateCurrentMode(currentmode);
                });
            });
        }, 'No', bool.true);
    });
}



function usbcmd(cmd, args = []) {
    var oldmode = currentmode;
    enableButtons(false);
    if (cmd.substring(0,4) != 'usb-') cmd = 'usb-'+cmd;

    if (cmd === 'usb-mass-storage') {
        if (args[0].toLowerCase().substring(0,4) == 'none') {            
            cmd = 'usb-none';
            args = [];
        }        
    }

    switch (cmd) {
        case 'usb-mass-storage':
            if (args[0] === external_sd+'.img') {
                if (fs.existsSync(external_sd)) args[0] = external_sd;
                else {
                    nwalert('Data SD is not detected.','Error');
                    enableButtons(true);
                    return false;
                }
            }        
            currentmode = 'Mass Storage '+args[0];
            if (args.length > 1) {
                if (args[1] === 'ro=1') currentmode += ' (R/O)';
            }
            break;
       
        case 'usb-ethernet':
            currentmode = 'Ethernet '+args[0];
            if (args[1] === 'static') currentmode += ' '+args[2];
            args.forEach(function(a,i) {
                if (a === 'use_eem=1') currentmode += ' CDC EEM (Win)';
                if (a === 'use_eem=0') currentmode += ' CDC ECM';
                if (a === 'use_ncm=1') {
                    currentmode += ' NCM (*nix)';
                    cmd = "usb-ethernet-ncm";
                    args.splice(i,1);
                }
            });
            break;

        case 'usb-none':
            currentmode = 'Disabled';
            break;

        default:
            currentmode = 'Unknown';
    }
    $('#mode').html('<strong>Processing... Please wait</strong>');
    exec(usbctrl+'/'+cmd, args, function(error, stdout) {        
        enableButtons(true);
        if (!error) updateCurrentMode(currentmode);
        else {
            updateCurrentMode(oldmode);
            nwalert("There was an error processing the command:\n"+error,'Error');
        }
    });        
}

function updateCurrentMode(m) {
    fs.writeFile(cmtmp,currentmode);
    mdiv = document.getElementById('mode');
    $(mdiv).html('<strong>Current Mode:</strong> '+m);
    menu(currentmenu);
    enableButtons(true);
}

function genButton(title,func,cmd,args = null) {
    var argstr = '';
    if (args != null && args.count > 0) {
	    args.forEach(function(a) {
    		args += "'"+a+"', ";
    	});
    	args = args.slice(0,-2);
        return "<button class=\"zefmenu\" onclick=\""+func+"('"+cmd+"',["+args+"])\">"+title+"</button>";
    } else {
        return "<button class=\"zefmenu\" onclick=\""+func+"('"+cmd+"')\">"+title+"</button>";
    }
}

function menu(m) {
    currentmenu = m;
    mdiv = document.getElementById('main');
    if (mdiv !== null) {
        $(mdiv).empty();       
        switch (m) {
            case 'mass_storage_rw':
            case 'mass_storage_iso':
                setLastMenu('mass_storage');
                fs.readdir(usbimg, function(err, items) {
                    if (!err) {
                        if (items.length > 0) {
                            var results = [];
                            for (var i=0; i<items.length; i++) {
                                var item = items[i];
                                var ext = 'img';
                                if (m === 'mass_storage_iso') ext = 'iso';

                                if (item.substring(item.length-ext.length,item.length).toLowerCase() == ext) {
                                    results.push(item.substring(0,item.length-(ext.length+1)));
                                }
                            }
                            var sd2avail = fs.existsSync('/dev/mmcblk1');
                            if (sd2avail && m === 'mass_storage_rw') results.push('/dev/mmcblk1');
                            if (results.length > 0) {
                                var sd2 = false;
                                var s = $('<select/>', {id : 'fileselect', class: 'zefmenu'});
                                for (var i in results) {
                                    if (currentmode.indexOf(results[i]) >= 0) {
                                        if (currentmode.indexOf('mmcblk1') > 0) sd2 = true; 
                                        s.append($('<option/>',{selected: 'selected'}).html(results[i]));
                                    } else {
                                        s.append($('<option/>').html(results[i]));
                                    }
                                }
                                $(mdiv).append(s);
                                if (m === 'mass_storage_rw') {
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass-storage',[document.getElementById('fileselect').value+'."+ext+"'])\" style=\"display: inline\">"+fa('lock-open')+"</button> ";
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass-storage',[document.getElementById('fileselect').value+'."+ext+"','ro=1'])\">"+fa('lock')+"</button> ";
                                }
                                if (m === 'mass_storage_iso') mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass-storage',[document.getElementById('fileselect').value+'."+ext+"','ro=1','cdrom=1'])\">"+fa('compact-disc')+"</button> ";
                                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass-storage',['none'])\">"+fa('eject')+"</button><br>";
                                if (!sd2 && sd2avail) mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"sd2flash([document.getElementById('fileselect').value+'."+ext+"'])\" style=\"display: inline\">"+fa('pen')+" "+fa('arrow-right')+" "+fa('sd-card')+"2</button><br>";
                            }
                        
                        }
                    }
                });
                break;

            case 'services':
                setLastMenu(null);
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('smbd')\">SMB</button> ";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('ssh')\">SSH</button> ";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"execmd('nmtui')\">Wifi</button><br> ";                
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('webmin')\">Webmin</button> ";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"loadsite('music','index.php')\">Music</button><br>";
                break;
                

            case 'mass_storage':
                setLastMenu(null);
                mdiv.innerHTML += genButton('Disk Images','menu','mass_storage_rw');
                mdiv.innerHTML += genButton('ISO Images','menu','mass_storage_iso');
                break;

            case 'ethernet':
                setLastMenu(null);
                var selopts = new Array();
                selopts.push({title: 'CDC EEM (Win)', value: 'use_eem=1'});
                selopts.push({title: 'CDC ECM', value: 'use_eem=0'});
                selopts.push({title: 'NCM (*nix)', value: 'use_ncm=1'});

                var s = $('<select/>', {id : 'modeselect', class: 'zefmenu'});
                for (var i in selopts) {
                    if (currentmode.indexOf(selopts[i].title.substr(0,5)) >= 0) {
                        s.append($('<option/>',{selected: 'selected', value: selopts[i].value, text: selopts[i].title}));
                    } else {
                        s.append($('<option/>',{value: selopts[i].value, text: selopts[i].title}));
                    }
                }
                $(mdiv).append(s);
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('ethernet',['static','"+staticip+"',document.getElementById('modeselect').value])\">Static (DHCP Host)</button><br>";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('ethernet',['dhcp',document.getElementById('modeselect').value])\">DHCP from Host</button><br>";
                break;

            default:
                setLastMenu(null);
                mdiv.innerHTML += genButton('USB Ethernet','menu','ethernet');
                mdiv.innerHTML += genButton('Disk Images','menu','mass_storage');
                mdiv.innerHTML += genButton('Services','menu','services');
                if (currentmode.length > 0 && currentmode != 'Disabled') {
                    mdiv.innerHTML += genButton('Disable USB','usbcmd','none');
                }                
                break;
        }
    }
}

function setLastMenu(menu) {
    $('#main').data('previous-menu',menu);
}

onload = function() {
    var logo = document.getElementById('logo');
    if ($.cookie('currentmenu')) {
        currentmenu = $.cookie('currentmenu');
        $.removeCookie('currentmenu');
    }
    $(logo).on('click', function() { 
        menu($('#main').data('previous-menu'));
    });
    fs.readFile(cmtmp,function(err,data) {
        if (!err) currentmode = data;
        updateCurrentMode(currentmode);
    });
}