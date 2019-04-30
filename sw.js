self.addEventListener('install', event => {
  console.log('install: ' + event)
});

self.addEventListener('fetch', event => {
  console.log('event: ' + event)
});
