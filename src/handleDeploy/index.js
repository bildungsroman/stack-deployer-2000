const stackery = require('stackery');
const child_process = require('child_process');
const lambdaGit = require('lambda-git');
const fs = require('fs-extra');
const glob = require('glob');
// sets the correct path in Lambda
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

function spawnPromise(command, options, repository) {
  console.log(`Running \`${command}\`...`);
  console.log('repository');
  console.log(repository);

  options = options || {};

  if (!options.env) {
    options.env = {}
  };

  Object.assign(options.env, process.env);

  options.env.GIT_AUTHOR_EMAIL = repository.owner.name;
  options.env.GIT_AUTHOR_NAME = repository.owner.name;
  options.env.GIT_COMMITTER_EMAIL = options.env.GIT_AUTHOR_EMAIL;
  options.env.GIT_COMMITTER_NAME = options.env.GIT_AUTHOR_NAME;
  options.env.GIT_TERMINAL_PROMPT = 0;

  return new Promise((resolve, reject) => {
    child_process.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        console.log('err: ' + err);

        reject(err)
      } else {
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}

exports.handler = async event => {
  // get the GitHub secret from the environment variables
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  // get the remaining variables from the GitHub event
  const headers = event.headers;
  const githubEvent = headers['X-GitHub-Event'];
  const body = JSON.parse(event.body);
  const { repository } = body;
  const repo = repository.name;
  const url = repository.html_url;

  // check for GitHub secret
  if (typeof token !== 'string') {
    let errMsg = 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }
  
  // Log git event to CloudWatch
  console.log('---------------------------------');
  console.log(`Github-Event: "${githubEvent}" on this repo: "${repo}".`);
  console.log('---------------------------------');
  console.log(`This is the repo url we'll be using to deploy: ${url}.git.`);
  console.log('---------------------------------');

  // pass on git url
  process.env['GIT_URL'] = url;
  // create a new directory for cloning the repo
  const localRepoDir = '/tmp/repo'
  // deletes directory contents if the directory is not empty
  fs.emptyDirSync(localRepoDir)

  // initialize lambda-git
  await lambdaGit({
    targetDirectory: localRepoDir
  });

  try {
    await spawnPromise(`./build.sh '${url}.git' '${localRepoDir}'`, repository);
    let files = glob.sync('**/*', { cwd: `${localRepoDir}/build`, nodir: true, dot: true });
    console.log('Success clone, install, and build: ', files, files.length);
    const promises = files.map((file) => {
      console.log('promise', file);
      const patternHtml = /\.html$/i;
      const patternJs = /.*\.js$/;
      const patternCss = /.*\.css$/i;
      const patternSvg = /.*\.svg$/i;
      const metadata = {};
      if (patternHtml.test(file)) {
        metadata['Content-Type'] = 'text/html';
        metadata['Cache-Control'] = 'no-cache';
      }
      else if (patternCss.test(file)) {
        metadata['Content-Type'] = 'text/css';
      }
      else if (patternJs.test(file)) {
        metadata['Content-Type'] = 'application/javascript';
      }
      else if (patternSvg.test(file)) {
        metadata['Content-Type'] = 'image/svg+xml';
      }
      return stackery.output({
        action: 'put',
        key: `${prNumber}/${file}`,
        body: fs.readFileSync(`${localRepoDir}/build/${file}`),
        metadata: metadata
      });
    });
    await Promise.all(promises);
    if (githubEvent === 'push') {
      return spawnPromise(`./deploy.sh`, repository);
    }
  }
  catch (err_1) {
    console.log('error', err_1);
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