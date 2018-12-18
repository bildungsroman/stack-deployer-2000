process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  // https://github.com/pimterry/lambda-git
  const lambdaGit = require('lambda-git');
  // use execFile to execute the bash process
  const execFile = require('child_process').execFile;
  // get the GitHub secret from the environment variables
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  // get the remaining variables from the GitHub event
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  const { repository } = body;
  const repo = repository.name;
  const url = repository.html_url;
  
  // check for secret
  if (typeof token !== 'string') {
    let errMsg = 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  // Log to CloudWatch
  console.log('---------------------------------');
  console.log(`Github-Event: "${githubEvent}" on this repo: "${repo}".`);
  console.log('---------------------------------');
  console.log(`This is the repo url we'll be using to deploy: ${url}.`);
  console.log('---------------------------------');

	await lambdaGit();
  await execFile('git', [`clone ${repo}`], (error, stdout, stderr) => {
    if (error) {
        console.error('stderr', stderr);
        throw error;
    }
    console.log('stdout', stdout);
  });
  await execFile('ls', ['-l'], (error, stdout, stderr) => {
    if (error) {
        console.error('stderr', stderr);
        throw error;
    }
    console.log('stdout', stdout);
  });

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