#!/bin/bash
PWD=$(realpath "$(dirname "${0}")")
cd "${PWD}"
npm start > /tmp/usbui.log 2>&1
