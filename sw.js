self.addEventListener('install', event => {
  console.log('install: ' + event)
});

self.addEventListener('activate', event => {
  console.log('activate: ' + event)
});

self.addEventListener('fetch', event => {
  console.log('fetch: ' + event)
  console.log('event.request.url: ' + event.request.url)
  event.respondWith(Response.redirect('https://glgtxhw4ouy7nhsepgqbtysvjn7ivoasvfzu37mn2ga6do2ktzda.litepages.googlezip.net/favicon.ico', 302))
});
