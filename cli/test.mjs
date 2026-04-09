import fs from 'fs';
import path from 'path';

const dirname = decodeURI(path.dirname(new URL(import.meta.url).pathname));

console.log(performance.now());

const main = () => {
  fs.readFile(path.join(dirname, 'data.txt'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data.length);
    console.log(performance.now());
  });
};

main();
