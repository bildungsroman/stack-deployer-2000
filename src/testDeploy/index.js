exports.handler = function(event, context, callback) {
  const exec = require('child_process').exec;

  exec('echo $PWD && ls', (error, stdout, stderr) => {
    if (error) {
      console.log("Error occurs");
      console.error(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}