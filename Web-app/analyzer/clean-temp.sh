#!/bin/bash

if [ $# -eq 0 ]; then
    cd ./analyzer
fi

rm -f globalactions.txt
rm -f curlout.html
rm -f xsserout.txt
rm -f out-sorted-https.txt