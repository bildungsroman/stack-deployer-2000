#!/bin/bash
set -x
set -e 

stackName=$1
stackEnv=$2

aws deploy --template-file 'template.yml' --stack-name $stackName-$stackEnv