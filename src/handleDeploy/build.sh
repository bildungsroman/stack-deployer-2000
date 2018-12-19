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