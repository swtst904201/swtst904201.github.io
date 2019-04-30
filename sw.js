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
  crypto.subtle.digest('SHA-256', mbuf).then(function(hbuf) {
    const harr = Array.from(new Uint8Array(hbuf));
    const hhex = harr.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    var b = 0;
    var bits = 0;
    var s = "";
    for (var i = 0; i < harr.length; i++) {
      b = (b << 8) + harr[i];
      bits += 8

      while (bits >= 5) {
	var cur = b >> (bits-5);
	b -= cur << (bits-5);
	bits -= 5

	console.log('b='+b+', cur='+cur);
	s += encodeStd[cur];
      }
    }
    if (bits > 0) {
      b = b << (5-bits);
      s += encodeStd[b];
    }
  });

  return s + ".litepages.googlezip.net";
}

function lpURL(origURL) {
  const url = new URL(origURL);
  const origin = "https://" + url.hostname + ":443";
  const newHost = lpHost(origin);
  url = new URL();
  url.hostname = newHost;
  url.pathname = "/sr";
  url.searchParams.set("u", encodeURI(origURL));
  return url
}


self.addEventListener('fetch', event => {
  console.log('fetch: ' + event)
  console.log('event.request.url: [' + event.request.url + ']')
  if (/^.*\.jpg$/.test(event.request.url)) {
    const url = new URL(event.request.url);
    console.log('matched: [https://' + url.hostname + ':443]')
    event.respondWith(Response.redirect(lpURL("https://www.google.com/favicon.ico"), 307))
  }
});
