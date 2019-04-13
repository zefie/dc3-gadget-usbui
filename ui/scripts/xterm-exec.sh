#!/bin/bash
matchbox-keyboard &
xterm -fa 'Monospace' -fs 6 -e "${@}"
killall matchbox-keyboard
