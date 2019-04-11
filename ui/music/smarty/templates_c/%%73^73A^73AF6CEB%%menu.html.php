<?php /* Smarty version 2.6.26, created on 2019-04-10 00:36:11
         compiled from default/menu.html */ ?>
		<div id="menu">
			<ul>
				<li><a <?php if ($this->_tpl_vars['page'] == 'browse'): ?>class="selected" <?php endif; ?>href="<?php echo $this->_tpl_vars['browse_link']; ?>
">Browse</a></li>
				<li><a <?php if ($this->_tpl_vars['page'] == 'playlist'): ?>class="selected" <?php endif; ?>href="<?php echo $this->_tpl_vars['playlist_link']; ?>
">Playlist</a></li>
				<li><a <?php if ($this->_tpl_vars['page'] == 'control'): ?>class="selected" <?php endif; ?>href="<?php echo $this->_tpl_vars['control_link']; ?>
">Control</a></li>
				<li><a class="exit" href="#" onclick="window.parent.closeweb();">X</a></li>
			</ul>
		</div>
