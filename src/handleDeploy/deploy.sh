#!/bin/bash
set -x
set -e 

stackName=$1
stackEnv=$2

# get the latest version of the Stackery CLI

stackery version
# stackery update

# deploy the stack
# stackery deploy --stack-name $stackName \
# --env-name $stackEnv \
# --git-ref 'master' --non-interactive