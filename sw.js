const encodeStd = 'abcdefghijklmnopqrstuvwxyz234567'
function lpHost(origin) {
  const mbuf = new TextEncoder('utf-8').encode(origin)
  return crypto.subtle.digest('SHA-256', mbuf).then(function(hbuf) {
    const harr = Array.from(new Uint8Array(hbuf));

    var s = ""
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

    return s + ".litepages.googlezip.net";
  });
}

function lpURL(origURL) {
  const url = new URL(origURL);
  const origin = "https://" + url.hostname + ":443";
  return lpHost(origin).then(function(h) {
    return new URL("https://" + h + "/sr?u=" + encodeURI(origURL));
  });
}

const lpAllowedHosts = [
  'www.google.com',
  'swtst904201.github.io',
];
const lpAllowedDestinations = [
  'image',
];

function lpHandle(event) {
  const url = new URL(event.request.url);
  if (lpAllowedHosts.includes(url.hostname) &&
      lpAllowedDestinations.includes(event.request.destination)) {
    event.respondWith(lpURL(event.request.url).then(function(ru) {
      console.log('lpHandle: [' + event.request.url + '] => [' + ru + ']');
      return Response.redirect(ru, 307);
    }));
    return true;
  }
  return false;
}

self.addEventListener('fetch', event => {
  if (lpHandle(event)) {
    return;
  }
});
