const { exec } = require('child_process');

const child_process = exec('ls', (err, stdout, stderr) => {
  if (err) {
    console.log(err);
  }
  console.log(stdout, stderr);
});

child_process.on('exit', (code) => {
  console.log(`${code} - Код выхода`);
});
