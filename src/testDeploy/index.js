exports.handler = function(event, context, callback) {
  const exec = require('child_process').exec;

  exec('echo $PWD && ls -l && env && cd /tmp && npm install aws-sdk && aws', (error, stdout, stderr) => {
    if (error) {
      console.log("Error occurs");
      console.error(error);
    }
    console.log("Doing things");
    console.log(stdout);
    console.log(stderr);
  });
  console.log("Did things");
}