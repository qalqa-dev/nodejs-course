fs = require('fs');

const data = fs.readFileSync('./test.txt');

console.log(data.toString());
