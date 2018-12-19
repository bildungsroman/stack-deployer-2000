#!/bin/bash
echo "Hello, World!" 

# print commands before executing
set -x
# abort if command fails
set -e

repo=$1
localRepoDir=$2

echo 'localRepoDir: ' $localRepoDir ', repo: ' $repo

cd $localRepoDir

git 'init'

git remote add origin $repo

git fetch origin master

git reset --hard FETCH_HEAD 

npm install --no-progress --loglevel=error --cache '/tmp/npm' --userconfig '/tmp/npmrc'

token=$1
cdnUrl=$2
postUrl=$3

curl --user "stackery-bot:$token" -H "Content-Type: application/json" --request POST --data '{"body": "Build preview: \n '"$cdnUrl"'"}' $postUrl