/* ── Calculator logic (mirrors the original C code) ── */

// do_sum, do_sub, do_mul, do_div, do_sqr from C source
function do_sum(x, y) { return x + y; }
function do_sub(x, y) { return x - y; }
function do_mul(x, y) { return x * y; }
function do_div(x, y) { return x / y; }
function do_sqr(x, y) { return Math.pow(x, y); }

// State
let xVal  = '';
let yVal  = '';
let op    = null;
let phase = 'x';   // 'x' = entering first number, 'y' = entering second

// DOM refs (resolved after DOMContentLoaded)
let elResult, elExpr;

document.addEventListener('DOMContentLoaded', () => {
  elResult = document.getElementById('result');
  elExpr   = document.getElementById('expr');
  bindKeyboard();
});

// ── Display helpers ────────────────────────────────── */
function opLabel(o) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^' }[o] || o;
}

function updateDisplay(value, expr) {
  elResult.className = 'display-value';
  elResult.textContent = value === '' ? '0' : value;
  elExpr.textContent   = expr  || '';
}

function showResult(value, expr) {
  elExpr.textContent = expr;
  elResult.className = 'display-value';
  elResult.textContent = value;
  // pop animation
  void elResult.offsetWidth;
  elResult.classList.add('pop');
}

function showError(msg, expr) {
  elExpr.textContent = expr || '';
  elResult.className = 'display-value error';
  elResult.textContent = msg;
}

// ── Button handlers ────────────────────────────────── */
function press(digit) {
  if (phase === 'x') {
    if (digit === '.' && xVal.includes('.')) return;
    if (digit === '.' && xVal === '') xVal = '0';
    xVal += digit;
    updateDisplay(xVal, '');
  } else {
    if (digit === '.' && yVal.includes('.')) return;
    if (digit === '.' && yVal === '') yVal = '0';
    yVal += digit;
    updateDisplay(yVal, xVal + ' ' + opLabel(op));
  }
}

function setOp(o) {
  if (xVal === '') return;
  op    = o;
  phase = 'y';
  yVal  = '';
  updateDisplay(xVal, '');
  // highlight active op button
  document.querySelectorAll('.btn-op').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.op === o);
  });
}

function equals() {
  if (xVal === '' || yVal === '' || op === null) return;

  const x   = parseFloat(xVal);
  const y   = parseFloat(yVal);
  const expr = xVal + ' ' + opLabel(op) + ' ' + yVal + ' =';
  let result;

  // mirrors the if/else chain in main() from the C code
  if      (op === '+') result = do_sum(x, y);
  else if (op === '-') result = do_sub(x, y);
  else if (op === '*') result = do_mul(x, y);
  else if (op === '/') {
    if (y === 0) {
      showError('Division by zero is not on the menu...', expr);
      reset();
      return;
    }
    result = do_div(x, y);
  }
  else if (op === '^') result = do_sqr(x, y);

  // Format: avoid floating-point noise (e.g. 0.1+0.2 = 0.30000000000004)
  const formatted = parseFloat(result.toPrecision(10)).toString();

  showResult(formatted, expr);

  // Carry result into next operation
  xVal  = formatted;
  yVal  = '';
  op    = null;
  phase = 'x';
  clearOpHighlight();
}

function del() {
  if (phase === 'x') {
    xVal = xVal.slice(0, -1);
    updateDisplay(xVal, '');
  } else {
    yVal = yVal.slice(0, -1);
    updateDisplay(yVal, xVal + ' ' + opLabel(op));
  }
}

function clear_() {
  reset();
  updateDisplay('', '');
  clearOpHighlight();
}

// ── Internal helpers ───────────────────────────────── */
function reset() {
  xVal  = '';
  yVal  = '';
  op    = null;
  phase = 'x';
}

function clearOpHighlight() {
  document.querySelectorAll('.btn-op').forEach(btn => btn.classList.remove('active'));
}

// ── Keyboard support ───────────────────────────────── */
function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if ('0123456789.'.includes(k))         { press(k);   return; }
    if (k === '+')                          { setOp('+'); return; }
    if (k === '-')                          { setOp('-'); return; }
    if (k === '*')                          { setOp('*'); return; }
    if (k === '/')  { e.preventDefault();   setOp('/'); return; }
    if (k === '^')                          { setOp('^'); return; }
    if (k === 'Enter' || k === '=')         { equals();   return; }
    if (k === 'Backspace')                  { del();      return; }
    if (k === 'Escape' || k === 'Delete')   { clear_();   return; }
  });
}
