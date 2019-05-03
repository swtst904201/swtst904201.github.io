importScripts('lplib.js')

self.addEventListener('fetch', event => {
  if (lpHandle(event)) {
    return;
  }
});
