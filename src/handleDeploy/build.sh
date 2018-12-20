#!/bin/bash

# print commands before executing
set -x
# abort if command fails
set -e

repo=$1
localRepoDir=$2
repoName=$3

echo 'localRepoDir: ' $localRepoDir ', repo: ' $repo ', repoName: ' $repoName

cd $localRepoDir

git 'init'

git clone $repo

cd $localRepoDir/$repoName

npm install --no-progress --loglevel=error --cache '/tmp/npm' --userconfig '/tmp/npmrc'