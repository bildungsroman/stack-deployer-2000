const child_process = require('child_process');

exports.handler = function(event, context) {
  console.log('Doing things');
  const child = child_process.spawn('/bin/bash', [ '-c', 'curl --silent --output - --max-time 1 https://9y8ud8ckk4.execute-api.us-west-2.amazonaws.com/development/test || true' ], { stdio: 'inherit' });
  console.log(child);

  child.on('close', function(code) {
    if(code !== 0) {
      return context.done(new Error("non zero process exit code"));
    }

    context.done(null);
  });
}