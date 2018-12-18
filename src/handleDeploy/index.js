process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {
  const AWS = require('aws-sdk');
  // use spawnSync to execute the bash process
  const spawn = require('child_process').spawnSync;
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
  console.log(event.body);
  console.log('---------------------------------');
  console.log(`This is the repo url we'll be using to deploy: ${url}.`);

  // spawnSync('./deploy.sh', (error, stdout, stderr) => {
  const child = execFile('node', ['--version'], (error, stdout, stderr) => {
      if (error) {
          console.error('stderr', stderr);
          throw error;
      }
      console.log('stdout', stdout);
  });

  console.log(child);

  // spawn('echo $PWD && ls -l && env && cd /tmp && echo $PWD', [], {}, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`spawnSync error: ${error}`);
  //     callback(error);
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.log(`stderr: ${stderr}`);

  //   callback(null, stdout);
  // });
}

// process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_SESSION_TOKEN are all available!