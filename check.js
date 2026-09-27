// Tries every step of the lab against your routes and prints what works.
// Run it with: npm run check
// It starts its own copy of your app, so `npm run dev` doesn't need to be running.
// You don't need to read or change this file.
import { app } from './src/app.js';

// The request logger prints a line for every request this file sends, which would
// bury the results. Keep console.log for the results only.
const print = console.log;
console.log = () => {};

// Port 0 lets the system pick any free port, so this works even while npm run dev is running.
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://localhost:${server.address().port}`;

const HEDGE_TRIMMER = '0405a72e-1e1e-4c19-ba7c-e5f02af2bdc1';
const CORDLESS_DRILL = 'cdcec443-777e-4c9a-b558-7e699f60ff7c';
const MISSING = '00000000-0000-4000-8000-000000000000';
const TIMEOUT_MS = 2000;

const validTool = { name: 'Pressure washer', category: 'cleaning', condition: 'new', available: true, maxLoanDays: 3 };

async function send(method, path, body) {
  const options = { method, signal: AbortSignal.timeout(TIMEOUT_MS) };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  let response;
  try {
    response = await fetch(base + path, options);
  } catch {
    // The route never called res.json() or res.end(), so the request timed out.
    return { status: `no response after ${TIMEOUT_MS / 1000} seconds`, body: null };
  }
  const text = await response.text();
  try {
    return { status: response.status, body: text ? JSON.parse(text) : null };
  } catch {
    return { status: response.status, body: text };
  }
}

function describe(res) {
  const body = JSON.stringify(res.body) ?? '';
  return `${res.status} ${body.length > 160 ? body.slice(0, 160) + '...' : body}`;
}

let passed = 0;
let failed = 0;

function check(label, ok, res) {
  if (ok) {
    passed++;
    print(`  ✓ ${label}`);
  } else {
    failed++;
    print(`  ✗ ${label}`);
    print(`      your API answered: ${describe(res)}`);
  }
}

let res;

print('\nStep 2: list and filter');
res = await send('GET', '/api/tools');
check('GET /api/tools answers 200 with all 6 tools', res.status === 200 && res.body?.data?.length === 6, res);
res = await send('GET', '/api/tools?category=garden');
check(
  'GET /api/tools?category=garden answers 200 with the 2 garden tools',
  res.status === 200 && res.body?.data?.length === 2 && res.body.data.every((tool) => tool.category === 'garden'),
  res,
);
res = await send('GET', '/api/tools?category=boats');
check('GET /api/tools?category=boats answers 400 with details.category', res.status === 400 && Boolean(res.body?.error?.details?.category), res);

print('\nStep 3: get one tool');
res = await send('GET', `/api/tools/${HEDGE_TRIMMER}`);
check('GET /api/tools/<hedge trimmer id> answers 200 with the hedge trimmer', res.status === 200 && res.body?.data?.id === HEDGE_TRIMMER, res);
res = await send('GET', `/api/tools/${MISSING}`);
check('GET /api/tools/<unknown id> answers 404 with an error message', res.status === 404 && Boolean(res.body?.error?.message), res);

print('\nStep 4: validation (these use the POST route from step 5)');
res = await send('POST', '/api/tools', { name: 'X', category: 'boats', condition: 'good', available: 'yes', maxLoanDays: 30 });
const details = res.body?.error?.details ?? {};
check(
  'four wrong fields answer 400 with name, category, available and maxLoanDays in details',
  res.status === 400 && ['name', 'category', 'available', 'maxLoanDays'].every((field) => field in details) && !('condition' in details),
  res,
);
res = await send('POST', '/api/tools', { ...validTool, condition: 'broken' });
check('condition "broken" answers 400 with details.condition', res.status === 400 && Boolean(res.body?.error?.details?.condition), res);
res = await send('POST', '/api/tools', { ...validTool, available: 'true' });
check('available "true" (text, not a boolean) answers 400 with details.available', res.status === 400 && Boolean(res.body?.error?.details?.available), res);
res = await send('POST', '/api/tools', { ...validTool, maxLoanDays: 2.5 });
check('maxLoanDays 2.5 answers 400 with details.maxLoanDays', res.status === 400 && Boolean(res.body?.error?.details?.maxLoanDays), res);
res = await send('POST', '/api/tools', { ...validTool, maxLoanDays: '3' });
check('maxLoanDays "3" (text, not a number) answers 400 with details.maxLoanDays', res.status === 400 && Boolean(res.body?.error?.details?.maxLoanDays), res);

print('\nStep 5: add a tool');
res = await send('POST', '/api/tools', { ...validTool, name: '  Pressure washer  ', id: 'my-own-id' });
const created = res.body?.data;
check(
  'POST /api/tools answers 201 with the new tool, a new id and the trimmed name',
  res.status === 201 && typeof created?.id === 'string' && created.id !== 'my-own-id' && created.name === 'Pressure washer',
  res,
);
res = await send('GET', '/api/tools');
check('the new tool is at the end of the list', res.body?.data?.at(-1)?.id === created?.id && created?.id !== undefined, res);

print('\nStep 6: change a tool');
const changes = { name: 'Hedge trimmer', category: 'garden', condition: 'worn', available: false, maxLoanDays: 5 };
res = await send('PUT', `/api/tools/${HEDGE_TRIMMER}`, changes);
check(
  'PUT /api/tools/<hedge trimmer id> answers 200 with the new fields and the same id',
  res.status === 200 && res.body?.data?.id === HEDGE_TRIMMER && res.body.data.condition === 'worn' && res.body.data.available === false,
  res,
);
res = await send('GET', `/api/tools/${HEDGE_TRIMMER}`);
check('GET shows the change afterwards', res.body?.data?.condition === 'worn', res);
res = await send('PUT', `/api/tools/${MISSING}`, changes);
check('PUT /api/tools/<unknown id> answers 404', res.status === 404, res);
res = await send('PUT', `/api/tools/${MISSING}`, { ...changes, name: 'X' });
check('PUT with an invalid body answers 400, even for an unknown id', res.status === 400, res);

print('\nStep 7: remove a tool');
// Step 7 can be checked before step 5 works, by deleting a starting tool instead.
const deleteId = created?.id ?? CORDLESS_DRILL;
res = await send('DELETE', `/api/tools/${deleteId}`);
check('DELETE /api/tools/<id> answers 204 with no body', res.status === 204 && res.body === null, res);
res = await send('GET', `/api/tools/${deleteId}`);
check('GET for that id answers 404 afterwards', res.status === 404, res);
res = await send('DELETE', `/api/tools/${deleteId}`);
check('DELETE the same id again answers 404', res.status === 404, res);

print(`\n${passed} of ${passed + failed} checks pass.\n`);
server.closeAllConnections();
server.close();
