const perf_hooks = require('perf_hooks');

test = perf_hooks.performance.timerify(test);

const performanceObserver = new perf_hooks.PerformanceObserver(
  (items, observer) => {
    console.log(items.getEntries());
    const slowEntry = items.getEntriesByName('slow')[0];
    console.log(`${slowEntry.name}: ${slowEntry.duration} ms`);
    observer.disconnect();
  },
);

performanceObserver.observe({ entryTypes: ['measure', 'function'] });

function test() {
  const arr = [];
  for (let i = 0; i < 10000000; i++) {
    arr.push(i * i);
  }
}

function slow() {
  performance.mark('start');
  const arr = [];
  for (let i = 0; i < 10000000; i++) {
    arr.push(i * i);
  }
  performance.mark('end');
  performance.measure('slow', 'start', 'end');
}

slow();
test();
