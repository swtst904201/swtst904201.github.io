self.addEventListener('install', event => {
  console.log('install: ' + event)
});

self.addEventListener('activate', event => {
  console.log('activate: ' + event)
});

const encodeStd = 'abcdefghijklmnopqrstuvwxyz234567'
function lpHost(origin) {
  const mbuf = new TextEncoder('utf-8').encode(origin)
  var s = ""
  const hashPromise = crypto.subtle.digest('SHA-256', mbuf).then(function(hbuf) {
    const harr = Array.from(new Uint8Array(hbuf));
    const hhex = harr.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    var b = 0;
    var bits = 0;
    for (var i = 0; i < harr.length; i++) {
      b = (b << 8) + harr[i];
      bits += 8

      while (bits >= 5) {
	var cur = b >> (bits-5);
	b -= cur << (bits-5);
	bits -= 5
	s += encodeStd[cur];
      }
    }
    if (bits > 0) {
      b = b << (5-bits);
      s += encodeStd[b];
    }
  });

  return hashPromise.then(function() {
    return s + ".litepages.googlezip.net";
  });
}

function lpURL(origURL) {
  const url = new URL(origURL);
  const origin = "https://" + url.hostname + ":443";
  return lpHost(origin).then(function(h) {
    const urlStr = "https://" + h + "/sr?u=" + encodeURI(origURL);
    console.log('urlStr=' + urlStr);
    return new URL(urlStr);
  });
}

const lpAllowedHosts = [
  'swtst904201.github.io',
];
const lpAllowedDestinations = [
  'image',
];
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  console.log('fetch: ' + event)
  console.log('event.request.url: [' + event.request.url + ']')
  // if (/^.*\.jpg$/.test(event.request.url)) {
  if (lpAllowedHosts.includes(url.hostname) &&
      lpAllowedDestinations.indlues(event.request.destination)) {
    console.log('matched: [https://' + url.hostname + ':443]')
    event.respondWith(lpURL(event.request.url).then(function(ru) {
      console.log('ru=' + ru);
      return Response.redirect(ru, 307);
    }));
  }
});
