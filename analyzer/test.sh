#!/bin/bash

# sudo apt install golang-go

# sudo apt install hakrawler

# git clone https://github.com/lc/gau.git
# sudo apt install go
# go build cmd/gau/main.go
# mv main gau

cd ./analyzer

purple_color() { echo -en "\e[35m\e[1m"; }
green_color() { echo -en "\e[32m\e[1m"; }
red_color() { echo -en "\e[31m\e[1m"; }
yellow_color() { echo -en "\e[33m\e[1m"; }
blue_color() { echo -en "\e[34m\e[1m"; }
default_color() { echo -en "\e[39m\e[0m"; }

touch globalactions.txt

DOM=$1
DOM=ikasten.io
#echo https://$DOM | hakrawler > out-hakrawler-https.txt
#cat out-hakrawler-https.txt | grep $DOM > out-sorted-https.txt;
var=$(cat out-sorted-https.txt); rm out-hakrawler-https.txt
lengthHTTPS=$(echo -e "$var" | wc -l)
echo "$lengthHTTPS" >&1

exit 0

#if [ "$MODE" == "s" ]; then
#    echo " > Silent mode: " $DOM
#    echo https://$DOM | maingau > out-gau.txt
#    cat out-gau.txt | grep $DOM > out-sorted.txt
#elif [ "$MODE" == "a" ]; then
#    echo " > Aggressive mode: " $DOM
#    echo https://$DOM | hakrawler > out-hakrawler.txt
#    cat out-hakrawler.txt | grep $DOM > out-sorted.txt
#    rm out-hakrawler.txt
#    nHref=$(cat out-sorted.txt | grep -c "\[href\]")
#    nScript=$(cat out-sorted.txt | grep -c "\[script\]")
#fi