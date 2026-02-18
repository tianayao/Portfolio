window.$ = (selector, root = document) => root.querySelector(selector);
window.$$ = (selector, root = document) => [...root.querySelectorAll(selector)];
