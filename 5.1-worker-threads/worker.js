const { parentPort, workerData } = require('worker_threads');
const factorial = require('./factorial.js');

const compute = ({ array }) => {
  const arr = [];
  for (let i = 0; i < 100000000; i++) {
    arr.push(i * i);
  }
  return array.map((n) => factorial(n));
};

parentPort.postMessage(compute(workerData));
