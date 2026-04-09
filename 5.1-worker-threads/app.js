const factorial = require('./factorial');

const compute = (array) => {
  const arr = [];
  for (let i = 0; i < 100000000; i++) {
    arr.push(i * i);
  }
  return array.map((n) => factorial(n));
};

const main = () => {
  performance.mark('main-start');
  const result = [
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
  ];

  console.log(result);

  performance.mark('main-end');
  performance.measure('main', 'main-start', 'main-end');
  console.log(performance.getEntriesByName('main')[0]);
};

main();
