#!/bin/bash
set -x
set -e 

stackName=$1
stackEnv=$2


stackery deploy --stack-name $stackName \
--env-name $stackEnv \
--git-ref 'master'