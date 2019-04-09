#!/bin/bash
PWD=$(realpath "$(dirname "${0}")")
cd "${PWD}"
nwjs-v0.28.4-linux-arm/nw --enable-logging=stderr . > /tmp/usbui.log 2>&1
