#!/bin/bash
set -x
set -e 

token=$1
url=$2

curl --user "stackery-bot:$token" -H "Content-Type: application/json" --request POST --data '{"body": "Build preview: \n '"$cdnUrl"'"}' $postUrl