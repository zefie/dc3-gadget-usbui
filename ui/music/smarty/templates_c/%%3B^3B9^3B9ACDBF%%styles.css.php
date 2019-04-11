<?php /* Smarty version 2.6.26, created on 2019-04-10 02:24:46
         compiled from default/styles.css */ ?>
::-webkit-scrollbar, ::-webkit-scrollbar-button { display: none; }

* {
	margin: 0px;
	padding: 0px;
}
img {
	border: 0;
}
a {
	text-decoration: none;
	color: #333;
}
body {
	background: #333 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_shadow.png) center 29px repeat-x fixed;
	color: #fff;
	font: 14px helvetica,verdana,sans-serif;
	text-align: center;
	margin: 30px 0px 0px 0px;
}
p {
	margin-bottom: 5px;
}
#menu {
	background: #111;
	position: fixed;
	width: 100%;
	height: 30px;
	top: 0px;
	padding: 0px 2px 0px 0px;
	z-index: 1;
	text-align: center;
}
#menu ul {
	width: 320px;
	margin: 0px auto;
}
#menu li {
	display: block;
	float: left;
}

.exit {
	width: 32px !important;
	background: #000 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_red.png) !important;
	color: #fff !important;
}

#menu a {
	background: #000 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_back.png);
	font: 14px helvetica,verdana,sans-serif;
	color: rgba(0, 0, 0, 1);;
	text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
	padding: 5px 0px 2px;
	float: left;
	margin-left: 0px;
	display: block;
	width: 90px;
	height: 23px;
	text-align: center;
	font-weight: bold;
}
#menu a:hover {
	background: #ccc url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_back_active.png);;
	color: #000;
}
#menu a:active {
	background: #ccc url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_back_active.png);;
	color: #000;
}
#menu a.selected {
	background: #333 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/menu_back_selected.png);
	color: #fff;
	width: 106px;
	text-shadow: 0 0 12px rgba(150, 210, 255, 0.9);
}
#list_header {
	height: 30px;
	padding: 0;
	width: 320px;
	margin: 0 auto;
}
#list_header p {
	padding: 8px 10px;
	text-align: left;
}
#list_header a#browse_back {
	display: block;
	float: left;
	width: 30px;
	height: 30px;
	margin-right: 5px;
	background: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/back.png) center center no-repeat;
}
#page {
	padding: 0px;
	clear: left;
}
#list {
	color: #333;
	margin: 0;
}
#list ul {
	background-color: #ddd;
	list-style-type: none;
	max-width: 320px;
	text-align: left;
	margin-left: auto;
	margin-right: auto;
}
#list ul.list {
	margin-top: 0;
}
#list ul .browse {
	display: block;
	padding: 5px 10px 5px 35px;
	border-top: 1px solid white;
	border-bottom: 1px solid #aaa;
}
#list ul .playlist_item {
	display: block;
	padding: 5px 10px 5px 10px;
	border-top: 1px solid white;
	border-bottom: 1px solid #aaa;
}
#list ul li.dir {
	background: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/folder.png) 10px center no-repeat;
}
#list ul li.track {
	background: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/music.png) 10px center no-repeat;
}
#list li .pos {
	float: left;
	padding-right: 10px;
	padding-top: 3px;
	font-size: 22px;
	color: #666;
	text-shadow: 1px 1px 2px rgba(255, 255, 255, 1);
	font-weight: bold;
}
li .remove,.add,.play {
	display: block;
	float: right;
	padding: 2px 0px 0px 0px;
	display: block;
}
li .add {
	padding-right: 3px;
}
li .remove {
	padding-right: 3px;
	padding-top: 8px;
}
li.playing a {
}
li .title {
	font-weight: bold;
}
#song_display {
	position: relative;
	width: 280px;
	height: 217px;
	margin: 40px auto -25px auto;
	height: 150px;
	text-align: left;
	font-size: 14px;
}
#page #pos {
	font-weight: bold;
}
#page #title {
	font-size: 10px;
	color: #ffc;
	font-weight: bold;
}
#page #song_info {
	position: relative;
	top: -10px;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	clear: both;
}
#page #album_info {
	position: absolute;
	top: 10px;
	left: 150px;
}
#page #artist {
	font-style: italic;
}
#page #album {
	color: #888;
}
#buttons {
	float: right;
	margin: 5px 5px 0px 0px;
	text-align: right;
}
#buttons_left {
	float: left;
	margin: 5px 5px 0px 5px;
	text-align: right;
}

img.icon {
	margin: 2px 2px -1px 2px;
	padding: 0;
}
img.button {
	float: right;
	margin: 2px 2px -1px 2px;
}
#controls {
	background: #666 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/control_back.png) center center repeat-x;
	text-align: center;
	margin: 8px 0px 0px 0px;
	padding: 10px 7px 10px 0px;
	height: 50px;
}
#controls .container {
	position: relative;
	width: 280px;
	margin: 0px auto;
}
#controls #main_controls {
	width: 280px;
}
#controls #main_controls li {
	display: block;
	float: left;
	border: 0;
}
#controls #main_controls a {
	background-image: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/buttons.png);
	background-repeat: no-repeat;
	display: block;
	float: left;
	width: 50px;
	height: 50px;
	margin-left: 7px;
}
#main_controls #prev_button {
	background-position: 0px 0px;
}
#main_controls #playpause_button {
	background-position: -50px 0px;
}
#main_controls #playpause_button.pause {
	background-position: -100px 0px;
}
#main_controls #stop_button {
	background-position: -150px 0px;
}
#main_controls #next_button {
	background-position: -200px 0px;
}

#main_controls #prev_button:hover {
	background-position: 0px -50px;
}
#main_controls #playpause_button:hover {
	background-position: -50px -50px;
}
#main_controls #playpause_button.pause:hover {
	background-position: -100px -50px;
}
#main_controls #stop_button:hover {
	background-position: -150px -50px;
}
#main_controls #next_button:hover {
	background-position: -200px -50px;
}

#volume_repeat {
	position: absolute;
	left: 250px;
}
#volume_repeat a {
	display: block;
	width: 30px;
	height: 20px;
	margin-bottom: 10px;
	background-position: 0px 0px;
	background-repeat: no-repeat;	
}
#volume_repeat #volume_button {
	background-image: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/volume_button.png);
}
#volume_repeat #repeat_button {
	background-image: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/repeat_button.png);
}
#volume_repeat #volume_button:hover {
	background-position: 0px -20px;
}
#volume_repeat #repeat_button:hover {
	background-position: 0px -20px;
}
#volume_repeat #repeat_button.selected {
	background-position: -30px 0px;
}
#volume_repeat #repeat_button.selected:hover {
	background-position: -30px -20px;
}

#volume_container {
	position: absolute;
	display: none;
	top: -140px;
	background: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/volume_container.png) center center no-repeat;
	height: 160px;
	width: 30px;
}
#volume_container #slider_container {
	position: absolute;
	padding: 0;
	margin: 0;
	top: 5px;
	height: 130px;
	width: 28px;
}
#volume_container a#volume_hide {
	position: absolute;
	top: 140px;
	left: 0px;
	width: 30px;
	height: 20px;
}
#volume_container #volume_slider {
	background: url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/volume_slider.png) center center no-repeat;
	position: absolute;
	top: 5px;
	left: 5px;
	width: 20px;
	height: 30px;
}

#crumb_trail ul {
	list-style-position: inside;
	text-align: left;
}

#crumb_trail li {
	display: inline;
	margin-left: 3px;
	border: 0px none !important;
}
#progress {
	background: #222 url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/progress_back.png) center center repeat-x;
	border: 1px solid #666;
	padding: 2px;
	width: 276px;
	height: 10px;
	margin: 5px auto 10px;
	text-align: left;
	clear: both;
}
#progressbar {
	font-size: 1px;
	background: #ccc url(templates/<?php echo $this->_tpl_vars['template']; ?>
/images/progress.png) center center repeat-x;;
	height: 10px;
	margin: 0px;
	padding: 0px;
}
#cover_image {
	float: left;
	height: 64px;
	width: 64px;
	margin: 10px 0px 20px;
}
img#cover {
	height: 64px;
	width: 64px;
	background: #111;
	padding: 2px;
	border: 1px solid #666;
}
#tracktime {
	font-weight: bold;
	position: absolute;
	top: 66px;
	left: 86px;
}
#tracktime #total {
	color: #666;
}