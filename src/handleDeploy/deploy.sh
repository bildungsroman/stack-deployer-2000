#!/bin/bash
echo "Hello, World!" 

# print commands before executing
set -x
# abort if command fails
set -e
# abort if pipe command fails
set -o pipefail

echo $PWD && ls -l && env

echo "building site"
timestamp=`date +'%s'`

cd /tmp
# mkdir ./$timestamp
# cd ./$timestamp
# git clone $local_repo
# cd ./stackery-ui-2
# git remote add upstream git@github.com:$remote/stackery-ui-2.git

echo "installing aws"
npm install

echo "testing aws"
aws

# git fetch upstream
# git checkout $branch
# ln -s $local_repo/node_modules .
# ls $local_repo/.env.* | grep -v '.env.prod' | grep -v '.env.stg1' | grep -v '.env.stg2' | xargs -I % cp -v % .
# time npm install

# echo "Building app"

# time REACT_APP_ENV=$1 npm run build

# echo "Uploading app"
# time REACT_APP_ENV=$1 npm run upload
# echo "done!"

# echo -e "\033[1;33mGenerating website conf\033[0;0m"
# ruby generate_website_conf.rb $1 > /tmp/$$.json
# echo -e "\033[1;33mUpdating website conf\033[0;0m"
# aws s3api put-bucket-website --bucket $bucket --profile prod --website-configuration "file:///tmp/$$.json"
# echo -e "\033[1;33mDeploying static files\033[0;0m"
# aws s3 sync _site/ s3://$bucket --profile prod --acl public-read --delete
