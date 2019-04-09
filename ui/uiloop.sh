#!/bin/bash
PWD=$(realpath "$(dirname "${0}")")
cd "${PWD}"
while (true); do
	./startui.sh
	sleep 1
done
