#!/bin/bash
PWD=$(realpath "$(dirname "${0}")")
source "${PWD}/_common"

while (true); do
	startx -- -nocursor
	if [ -e "${USBUI_ROOT}/ui/images/starting.fbraw" ]; then
		sudo dd if="${USBUI_ROOT}/ui/images/starting.fbraw" of=/dev/fb0 bs=16k
	fi
	sleep 3;
done
