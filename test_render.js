const vm = require('vm');
const fs = require('fs');

const kanjiCode = fs.readFileSync('./kanji-data.js', 'utf8');
const appCode = fs.readFileSync('./app.js', 'utf8');

const mockElement = {
  value: '1990',
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  style: {},
  innerHTML: '',
  textContent: '',
  appendChild: () => {},
  removeChild: () => {},
  setAttribute: () => {},
  getAttribute: () => null,
  scrollIntoView: () => {},
  querySelector: () => mockElement,
  querySelectorAll: () => [mockElement],
  classList: { add: () => {}, remove: () => {}, contains: (c) => c === 'hidden' ? false : false, toggle: () => {} },
  dataset: {},
};

const inputs = {
  '#lastName': { value: '田中' },
  '#firstName': { value: '太郎' },
  '#birthYear': { value: '1990' },
  '#birthMonth': { value: '5' },
  '#birthDay': { value: '15' },
  '#gender': { value: 'male' },
};

const ctx = {
  console,
  document: {
    querySelector: (sel) => inputs[sel] || mockElement,
    querySelectorAll: () => [mockElement],
    body: { classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} } },
    createElement: () => mockElement,
    getElementById: () => mockElement,
  },
  window: { innerWidth: 1024, scrollTo: () => {} },
  alert: (m) => console.log('ALERT: ' + m),
  Date,
  Math,
  parseInt,
  isNaN,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Error,
  Map,
  Set,
  Symbol,
  Promise,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  QRCode: { toCanvas: () => {} },
};

try {
  vm.runInNewContext(kanjiCode, ctx);
  console.log('kanji-data.js loaded OK');
} catch(e) {
  console.log('kanji-data.js ERROR: ' + e.message);
  console.log(e.stack);
}

try {
  vm.runInNewContext(appCode, ctx);
  console.log('app.js loaded OK');
} catch(e) {
  console.log('app.js ERROR: ' + e.message);
  console.log(e.stack);
}

// Test render
try {
  ctx.render({ preventDefault: () => {} });
  console.log('render() executed OK');
} catch(e) {
  console.log('render() ERROR: ' + e.message);
  console.log(e.stack);
}
