import { randomBytes } from 'crypto';
import { writeFileSync } from 'fs';

const start = performance.now();

const count = Number(process.argv[2] ?? 100);
const filePath = process.argv[3] ?? './data.txt';

const randomLine = () => randomBytes(100).toString('hex');
const data = Array.from({ length: count }, randomLine).join('\n');

writeFileSync(filePath, data);
console.log(
  `Файл ${filePath} заполнен ${count} строками случайных данных. Время выполнения: ${performance.now() - start} мс.`,
);
