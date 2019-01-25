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


# [stackery]
#   key = "$stackeryKey"
#   secret = "$stackerySecret"



# get AWS creds from process.env

# deploy the stack
# stackery deploy --stack-name $stackName \
# --env-name $stackEnv \
# --git-ref 'master' --non-interactive