exports.handler = function(event, context, callback) {
  const exec = require('child_process').exec;
  console.log("Doing things");
  
  exec('echo $PWD && ls -l && env && cd /tmp && echo $PWD && export HOME="/tmp" && npm install aws-sdk --prefix="/tmp" && aws', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  console.log("Did things");
}