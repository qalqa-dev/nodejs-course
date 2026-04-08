fs = require('fs');
path = require('path');

const data = fs.readFileSync(`./test.txt`, 'utf-8');

console.log(data.toString());
