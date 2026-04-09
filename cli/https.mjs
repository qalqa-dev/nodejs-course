import http from 'http';
import https from 'https';
import { URL } from 'url';

process.env.UV_THREADPOOL_SIZE = 12;

const target = 'https://ассоциацияпредпринимателей.рф/api/regions';
const totalSessions = Number(process.argv[2] ?? 50);
const concurrency = Number(process.argv[3] ?? 50);
const reportInterval = Number(process.argv[4] ?? 5);
const resourceConcurrency = Number(process.argv[5] ?? 10);

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: concurrency * 4,
});
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: concurrency * 4,
});

const startTime = performance.now();
let completed = 0;
let errors = 0;
let started = 0;

const getAgent = (url) => (url.protocol === 'https:' ? httpsAgent : httpAgent);

const fetchUrl = (urlString) =>
  new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const client = url.protocol === 'https:' ? https : http;
      const req = client.get(url, { agent: getAgent(url) }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks) });
        });
      });

      req.on('error', () => resolve({ status: null, body: null }));
    } catch (err) {
      resolve({ status: null, body: null });
    }
  });

const extractResourceUrls = (html, baseUrl) => {
  const urls = new Set();
  const base = new URL(baseUrl);
  const srcRegex =
    /<(?:img|script|iframe|audio|video|source|embed|track|link)\b[^>]*(?:src|href|data-src|srcset)=['"]([^'"]+)['"]/gi;
  const styleRegex = /style=['"][^'"]*url\(([^)]+)\)[^'"]*['"]/gi;

  const addUrl = (raw) => {
    raw = raw.trim().replace(/^['"]|['"]$/g, '');
    if (!raw || raw.startsWith('javascript:') || raw.startsWith('data:'))
      return;
    try {
      const absolute = new URL(raw, base).toString();
      urls.add(absolute);
    } catch {
      // ignore invalid URLs
    }
  };

  let match;
  while ((match = srcRegex.exec(html)) !== null) {
    const value = match[1];
    if (value.includes(',')) {
      value.split(',').forEach((item) => addUrl(item.split(' ')[0]));
    } else {
      addUrl(value);
    }
  }

  while ((match = styleRegex.exec(html)) !== null) {
    addUrl(match[1]);
  }

  return Array.from(urls).filter((item) => item.startsWith('http'));
};

const fetchResources = async (urls) => {
  let index = 0;
  let resourceErrors = 0;

  const worker = async () => {
    while (index < urls.length) {
      const current = index;
      index += 1;
      const { status } = await fetchUrl(urls[current]);
      if (status !== 200) resourceErrors += 1;
    }
  };

  const workers = Array.from(
    { length: Math.min(resourceConcurrency, urls.length) },
    worker,
  );
  await Promise.all(workers);
  return resourceErrors;
};

const loadPageWithResources = async () => {
  const { status, body } = await fetchUrl(target);
  if (status !== 200 || !body) {
    return { status, resources: 0, errors: 1 };
  }

  const html = body.toString('utf8');
  const resourceUrls = extractResourceUrls(html, target);
  const resourceErrors = await fetchResources(resourceUrls);

  return {
    status,
    resources: resourceUrls.length,
    errors: resourceErrors,
  };
};

const run = async () => {
  const workers = [];

  const next = async () => {
    if (started >= totalSessions) return;
    started += 1;
    const result = await loadPageWithResources();

    completed += 1;
    errors += result.errors;

    if (completed % reportInterval === 0 || completed === totalSessions) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      process.stdout.write(
        `sessions=${completed}/${totalSessions} elapsed=${elapsed}s errors=${errors} resources=${result.resources}\r`,
      );
    }

    if (started < totalSessions) {
      await next();
    }
  };

  for (let i = 0; i < Math.min(concurrency, totalSessions); i += 1) {
    workers.push(next());
  }

  await Promise.all(workers);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(
    `\nDone: sessions=${totalSessions} errors=${errors} time=${elapsed}s`,
  );
};

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
