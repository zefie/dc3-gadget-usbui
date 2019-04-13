#!/bin/sh

BL="/sys/class/backlight/backlight"

# Make sure there's backlight control
ls ${BL}/* >/dev/null 2>&1 || exit

process() {
	while read line; do
		# echo output appears in ~/.xsession-errors when script is autostarted
		echo "$line"
		case "$line" in
			UNBLANK*)
				echo 0 | sudo tee ${BL}/bl_power 1>/dev/null
			;;
			BLANK*)
				echo 1 | sudo tee ${BL}/bl_power 1>/dev/null
			;;
		esac
	done
}

if [ -z "${1}" ]; then
	xscreensaver-command -watch | process
else
	echo "${1}" | sudo tee ${BL}/bl_power 1>/dev/null
fi
