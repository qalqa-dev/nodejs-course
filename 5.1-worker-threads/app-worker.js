const { Worker } = require('worker_threads');
const path = require('path');

const compute = (array) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: {
        array,
      },
    });

    worker.on('message', (msg) => {
      console.log(worker.threadId);
      resolve(msg);
    });

    worker.on('error', (err) => {
      reject(err);
    });

    worker.on('exit', () => {
      console.log('Завершил работу');
    });
  });
};

const main = async () => {
  performance.mark('main-start');
  const result = await Promise.all([
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
    compute([25, 20, 20, 19, 48, 30, 50]),
  ]);

  console.log(result);

  performance.mark('main-end');
  performance.measure('main', 'main-start', 'main-end');
  console.log(performance.getEntriesByName('main')[0]);
};

main();
