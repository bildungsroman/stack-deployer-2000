#!/bin/bash
# usage "bash ./deploy.sh production

# print commands before executing
set -x
# abort if command fails
set -e
# abort if pipe command fails
set -o pipefail

echo "installing dependencies"
npm install

# echo "building blog site"
# (
#   cd ../stackery-blogs &&
#   git pull origin master &&
#   bundle install &&
#   ALGOLIA_API_KEY='50748ca1d1f72cadd07055188d8e5f15' bundle exec jekyll algolia &&
#   bundle exec jekyll build --destination ../Stackery-WWW-2018/_site/blog
# )


# echo -e "\033[1;33mChecking that blog and www index exist\033[0;0m"
# if [[ ! -f _site/index.html || ! -f _site/blog/index.html ]]; then
#   echo -e "\033[0;31mMissing _site/index.html or _site/blog/index.html\033[0;0m"
#   echo -e "\033[0;31mAborting\033[0;0m"
#   exit 1

# fi

# echo -e "\033[1;33mGenerating website conf\033[0;0m"
# ruby generate_website_conf.rb $1 > /tmp/$$.json
# echo -e "\033[1;33mUpdating website conf\033[0;0m"
# aws s3api put-bucket-website --bucket $bucket --profile prod --website-configuration "file:///tmp/$$.json"
# echo -e "\033[1;33mDeploying static files\033[0;0m"
# aws s3 sync _site/ s3://$bucket --profile prod --acl public-read --delete