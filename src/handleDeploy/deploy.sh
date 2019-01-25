#!/bin/bash
set -x
set -e 


stackeryKey=$1
stackerySecret=$2
stackName=$3
stackEnv=$4

# get the latest version of the Stackery CLI
stackery update

# make stackery.toml file with secrets credentials
touch stackery.toml

echo $stackeryKey
echo $stackerySecret
echo $stackName
echo $stackEnv

ls

# [stackery]
#   key = "$stackeryKey"
#   secret = "$stackerySecret"



# get AWS creds from process.env

# deploy the stack
# stackery deploy -n $stackName -e $stackEnv -r master --aws-profile $awsProfile (get from env?)
# stackery deploy --stack-name $stackName \
# --env-name $stackEnv \
# --git-ref 'master' --non-interactive