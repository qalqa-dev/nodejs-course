const crypto = require('crypto');

process.env.UV_THREADPOOL_SIZE = 8;

const start = performance.now();

for (let i = 0; i < 50; i++) {
  crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', () => {
    console.log(performance.now() - start);
  });
}
