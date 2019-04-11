var ngui = require('nw.gui');
var nwin = ngui.Window.get();
nwin.enterFullscreen();
//nwin.showDevTools();
var fs = require('fs');
var path = require("path");
const { spawn, exec } = require('child_process');
var express = require('express');
var php = require("node-php"); 
var path = require("path"); 

var express_port = 9090;
var usbroot = path.normalize(process.cwd()+'/../');
var usbctrl = path.normalize(usbroot+'/ctrl/');
var usbimg = path.normalize(usbroot+'/images/');
var usbui = path.normalize(usbroot+'/ui/');
var cmtmp = '/tmp/currentmode.zef'; // use tmp because its in ram
var staticip = '192.168.57.3/27';
var currentmenu = null;
var currentmode = 'Disabled';
var app = null;
var current_http = null;

function loadsite(webapp, index = '') {
    mdiv = document.getElementById('wrapper');
    $(mdiv).hide();
    mdiv = document.getElementById('webframe');
    app = express();
    app.use("/", php.cgi(usbui+'/'+webapp)); 
    current_http = app.listen(express_port);
    
    $(mdiv).attr('src',"http://localhost:"+express_port+'/'+index);
    $(mdiv).show();
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
        width: '240px',
        height: 'auto',
        bgiframe: false,
        buttons: [
            { text: btn1text, "class": btn1css, click: function () {
                if (typeof(clickfunc) === 'function') clickfunc();
                $("#dialog").dialog('close');
                }
            }, { 
              text: btn2text, "class": btn2css, click: function () {
                if (typeof(clickfunc2) === 'function') clickfunc2();
                $("#dialog").dialog('close');
              }
            }
        ]
    });
}

function servicetoggle(service, truetoggle = false) {
    mdiv = document.getElementById('mode');
    if (!truetoggle) {
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
                $(':button').prop('disabled', true);
                exec(usbctrl+'/service-toggle '+service, function (error, stdout) {
                    $(':button').prop('disabled', false);
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
            }, 'No');
            
        });
    }
}



function usbcmd(cmd, args = []) {
    if (cmd === 'mass_storage') {
        if (args[0].toLowerCase().substring(0,4) == 'none') {            
            cmd = 'none';
            args = [];
        }        
    }

    switch (cmd) {
        case 'mass_storage':
            currentmode = 'Mass Storage '+args[0];
            if (args.length > 1) {
                if (args[1] === 'ro=1') currentmode += ' (R/O)';
            }
            break;
       
        case 'ethernet':
            currentmode = 'Ethernet '+args[0];
            if (args[1] === 'static') currentmode += ' '+args[2];
            args.forEach(function(a,i) {
                if (a === 'use_eem=1') currentmode += ' CDC EEM (Win)';
                if (a === 'use_eem=0') currentmode += ' CDC ECM';
                if (a === 'use_ncm=1') {
                    currentmode += ' NCM (*nix)';
                    cmd = "ethernet-ncm";
                    args.splice(i,1);
                }
            });
            break;

        case 'none':
            currentmode = 'Disabled';
            break;

        default:
            currentmode = 'Unknown';
    }
    console.log(args);
    spawn(usbctrl+'/'+cmd, args);
    updateCurrentMode(currentmode);
}

function updateCurrentMode(m) {
    fs.writeFile(cmtmp,currentmode);
    mdiv = document.getElementById('mode');
    $(mdiv).html('<strong>Current Mode:</strong> '+m);
    menu(currentmenu);
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
                            if (results.length > 0) {
                                var s = $('<select/>', {id : 'fileselect'});
                                for (var i in results) {
                                    if (currentmode.indexOf(results[i]) >= 0) {
                                        s.append($('<option/>',{selected: 'selected'}).html(results[i]));
                                    } else {
                                        s.append($('<option/>').html(results[i]));
                                    }
                                }
                                $(mdiv).append(s);
                                if (m === 'mass_storage_rw') {
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass_storage',[document.getElementById('fileselect').value+'."+ext+"'])\" style=\"display: inline\">R/W</button>";
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass_storage',[document.getElementById('fileselect').value+'."+ext+"','ro=1'])\">R/O</button>";
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass_storage',['none'])\">Unmount</button>";
                                }
                                if (m === 'mass_storage_iso') {
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass_storage',[document.getElementById('fileselect').value+'."+ext+"','ro=1','cdrom=1'])\">Mount ISO</button>";
                                    mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"usbcmd('mass_storage',['none'])\">Unmount</button>";
                                }
                            }
                        
                        }
                    }
                    mdiv.innerHTML += genButton('<- Previous','menu','mass_storage');
                });
                break;

            case 'services':
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('smbd')\">SMB</button> ";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('ssh')\">SSH</button><br>";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"servicetoggle('webmin')\">Webmin</button> ";
                mdiv.innerHTML += "<button class=\"zefmenu\" onclick=\"loadsite('music','index.php')\">Music</button><br>";
                mdiv.innerHTML += genButton('<- Main Menu','menu',null);
                break;
                

            case 'mass_storage':
                mdiv.innerHTML += genButton('Disk Images','menu','mass_storage_rw');
                mdiv.innerHTML += genButton('ISO Images','menu','mass_storage_iso');
                mdiv.innerHTML += genButton('<- Main Menu','menu',null);
                break;

            case 'ethernet':
                var selopts = new Array();
                selopts.push({title: 'CDC EEM (Win)', value: 'use_eem=1'});
                selopts.push({title: 'CDC ECM', value: 'use_eem=0'});
                selopts.push({title: 'NCM (*nix)', value: 'use_ncm=1'});

                var s = $('<select/>', {id : 'modeselect'});
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
                mdiv.innerHTML += genButton('<- Main Menu','menu',null);
                break;

            default:
                mdiv.innerHTML += genButton('USB Ethernet','menu','ethernet');
                mdiv.innerHTML += genButton('USB Mass Storage','menu','mass_storage');
                mdiv.innerHTML += genButton('Services','menu','services');
                if (currentmode.length > 0 && currentmode != 'Disabled') {
                    mdiv.innerHTML += genButton('Disable USB','usbcmd','none');
                }                
                break;
        }
    }
}

onload = function() {
    fs.readFile(cmtmp,function(err,data) {
        if (!err) currentmode = data;
        updateCurrentMode(currentmode);
    });
}