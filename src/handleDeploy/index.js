process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {
  const AWS = require('aws-sdk');
  // use spawnSync to execute the bash process
  const spawnSync = require('child_process').spawnSync;
  // get the GitHub secret from the environment variables
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  // get the remaining variables from the GitHub event
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  // this prevents errors from the GitHub ping event
  const username = body.pusher ? body.pusher.name : body.repository.owner.login;
  const message = body.pusher ? `${username} pushed this awesomeness/atrocity through (delete as necessary)` : `It's ${username}'s repo - blame them.`
  
  const { repository } = body;
  const repo = repository.name;
  const url = repository.url;
  

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
  console.log(`Github-Event: "${githubEvent}" on this repo: "${repo}" at the url: ${url}.\n ${message}`);
  console.log('---------------------------------');
  console.log(event.body);
  console.log('---------------------------------');


  console.log('process.env');
  console.log(process.env);

  spawnSync('./deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      callback(error);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    callback(null, stdout);
  });
}
