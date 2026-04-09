import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 1000 users over 30s
    { duration: '1m', target: 100 }, // Stay at 1000 users for 1m
    { duration: '30s', target: 1000 }, // Ramp up to 100 users over 30s
    { duration: '2m', target: 1000 }, // Stay at 100 users for 2m
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'], // Error rate should be below 10%
  },
};

const target = 'https://ассоциацияпредпринимателей.рф/api/regions/for_map';

function getAbsoluteUrl(base, relative) {
  try {
    const url = new URL(relative, base);
    return url.toString();
  } catch {
    return null;
  }
}

function extractResourceUrls(html, baseUrl) {
  const urls = new Set();
  const srcRegex =
    /<(?:img|script|iframe|audio|video|source|embed|track|link)\b[^>]*(?:src|href|data-src|srcset)=['"]([^'"]+)['"]/gi;
  const styleRegex = /style=['"][^'"]*url\(([^)]+)\)[^'"]*['"]/gi;

  const addUrl = (raw) => {
    raw = raw.trim().replace(/^['"]|['"]$/g, '');
    if (!raw || raw.startsWith('javascript:') || raw.startsWith('data:'))
      return;
    const absolute = getAbsoluteUrl(baseUrl, raw);
    if (absolute && absolute.startsWith('http')) {
      urls.add(absolute);
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

  return Array.from(urls);
}

export default function () {
  // Load main page
  const mainResponse = http.get(target);
  check(mainResponse, {
    'main page status is 200': (r) => r.status === 200,
    'main page response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  if (mainResponse.status !== 200) {
    return; // Skip resource loading if main page failed
  }

  // Extract resource URLs using regex
  const resourceUrls = extractResourceUrls(mainResponse.body, target);

  // Load up to 20 resources per page to simulate browser behavior
  const urlsToLoad = resourceUrls.slice(0, 20);

  // Load resources in parallel
  if (urlsToLoad.length > 0) {
    const resourceRequests = urlsToLoad.map((url) => ({ method: 'GET', url }));
    const resourceResponses = http.batch(resourceRequests);

    check(resourceResponses, {
      'all resources loaded': (rs) => rs.every((r) => r.status === 200),
    });
  }

  // Simulate user think time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}
