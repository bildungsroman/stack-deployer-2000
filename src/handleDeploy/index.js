process.env['PATH'] = process.env['PATH'] + ':' + process.cwd()

exports.handler = function(event, context, callback) {
  const AWS = require('aws-sdk');
  const execFile = require('child_process').execFile;
  execFile('./deploy.sh', (error, stdout, stderr) => {
    if (error) {
      callback(error);
    }
    callback(null, stdout);
  });
}
