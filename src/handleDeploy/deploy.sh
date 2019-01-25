#!/bin/bash
set -x
set -e 

stackeryKey=$1
stackerySecret=$2
stackName=$3
stackEnv=$4
# these won't be in the final version
stackeryEnv=$5
stackeryUserPoolId=$6
stackeryUserPoolClientId=$7

# check directory
pwd

# make stackery.toml file with secrets credentials
touch stackery.toml

sed '/^cdef$/r'<(
    echo "[stackery]"
    echo "  key = '$stackeryKey'"
    echo "  secret = '$stackerySecret'"
) -i -- stackery.toml

# [stackery]
#   key = "$stackeryKey"
#   secret = "$stackerySecret"
# echo "insert text here" > stackery.toml

ls

cat stackery.toml

# get the latest version of the Stackery CLI
stackery update

# get AWS creds from process.env, write to $awsProfile

# deploy the stack
# STACKERY_ENV=$stackeryEnv STACKERY_USER_POOL_ID=$stackeryUserPoolId STACKERY_USER_POOL_CLIENT_ID=$stackeryUserPoolClientId stackery deploy -n $stackName -e $stackEnv -r master --aws-profile $awsProfile (get from env?)
# stackery deploy --stack-name $stackName \
# --env-name $stackEnv \
# --git-ref 'master' --non-interactive