const child_process = require('child_process')
const fs = require('fs-extra');
const AWS = require('aws-sdk');
const stackery = require('stackery');
// sets the correct path in Lambda
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

function spawnPromise(command, options) {
  console.log(`Running \`${command}\`...`);

  options = options || {};

  if (!options.env) {
    options.env = {}
  };

  Object.assign(options.env, process.env);

  console.log('process.env', process.env);

  return new Promise((resolve, reject) => {
    child_process.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout
        err.stderr = stderr

        reject(err)
      } else {
        console.log("Finished shell script", stdout, stderr)
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}

exports.handler = async event => {
  // get the GitHub secret and token from the environment variables
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const token = process.env.GITHUB_TOKEN;
  // get the remaining variables from the GitHub event
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  const branch = body.ref;
  const { repository } = body;
  const repo = repository.name;
  const url = repository.html_url;
  // so 'ping' events don't fail
  const owner = repository.owner.name ? repository.owner.name : repository.owner.login;
  // get env from process.env
  const env = 'development';

  // check for GitHub secret
  if (typeof secret !== 'string') {
    let errMsg = 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }
  
  // Log git event to CloudWatch
  console.log('---------------------------------');
  console.log(`Github-Event: "${githubEvent}" on this repo: "${owner}/${repo}", on branch "${branch}".`);
  console.log('---------------------------------');
  console.log(`This is the repo url we'll be using to deploy: ${url}.git`);
  console.log('---------------------------------');

  // create a new directory for stackery
  const localRepoDir = `/tmp/${repo}`
  // deletes directory contents if the directory is not empty
  fs.emptyDirSync(localRepoDir)

  try {
    // only trigger deploy for a 'push' event on the 'master' branch
    if (githubEvent === 'push' && branch === 'refs/heads/master') {
      await spawnPromise(`./deploy.sh '${process.env.STACKERY_KEY}' '${process.env.STACKERY_SECRET}' '${repo}' '${env}' '${process.env.STACKERY_ENV}' '${process.env.STACKERY_USER_POOL_ID}' '${process.env.STACKERY_USER_POOL_CLIENT_ID}'`);
    }
  }
  catch (err_1) {
    console.log('another error', err_1);
  }

  // return a 200 response if the GitHub tokens match
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };

  return response;
}

// process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_SESSION_TOKEN are all available!