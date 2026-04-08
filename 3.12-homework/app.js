const args = process.argv.slice(2);
const input = process.stdin;

const modes = {
  cli: 'cli',
  input: 'input',
};

const ops = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/',
};

const calculateCli = () => {};

const calculateInput = (str) => {
  ops;
};

console.log(calculateInput('25+14-19'));

switch (args[0]) {
  case modes.cli:
    break;
  case modes.input:
    break;
  default:
}
