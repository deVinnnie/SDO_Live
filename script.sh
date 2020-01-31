#!/bin/sh
URL='https://sdo.gsfc.nasa.gov/assets/img/browse/'`date +%Y/%m/%d/`
IMAGE_RESOLUTION='1024'
curl --max-time 30 "$URL" | grep '<a.*' | sed -n "s/^.*href=\"\(\S*\)\".*$/\1/p" | grep "_${IMAGE_RESOLUTION}_" | tac | head -n 50 > listing.txt
