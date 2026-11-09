const cases = [];
export function test(name, run) { cases.push({ name, run }); }
export function assert(condition, message = 'Assertion failed') {
  if (!condition) throw new Error(message);
}
export function equal(actual, expected, message = '') {
  assert(Object.is(actual, expected), `${message} Expected ${String(expected)}, received ${String(actual)}`);
}
export async function runSuites(paths) {
  const results = [];
  const report = (name, error) => {
    results.push({ name, passed: !error, error: error?.message ?? null });
    const item = document.createElement('li');
    item.textContent = `${error ? 'FAIL' : 'PASS'}: ${name}${error ? ` — ${error.message}` : ''}`;
    document.querySelector('#test-results').append(item);
  };
  for (const path of paths) {
    try { await import(new URL(path, import.meta.url)); }
    catch (error) { report(`Load ${path}`, error); }
  }
  for (const { name, run } of cases) {
    try { await run(); report(name); }
    catch (error) { report(name, error); }
  }
  const failures = results.filter(result => !result.passed).length;
  document.querySelector('#test-summary').textContent = `${results.length - failures}/${results.length} passed; ${failures} failed`;
  document.documentElement.dataset.testStatus = failures ? 'failed' : 'passed';
  globalThis.testResults = results;
  return results;
}
