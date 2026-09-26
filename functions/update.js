export async function onRequest(context) {
  const req = context.request;
  const secFetchDest = req.headers.get('sec-fetch-dest') || '';
  const upgradeInsecure = req.headers.get('upgrade-insecure-requests') || '';

  // Java HttpURLConnection in Android background download thread sends only User-Agent,
  // with no sec-fetch-dest, no upgrade-insecure-requests, no sec-ch-ua, and no accept-language.
  const isJavaDownloader =
    !secFetchDest &&
    !upgradeInsecure &&
    !req.headers.has('sec-ch-ua') &&
    !req.headers.has('accept-language');

  if (isJavaDownloader) {
    // Return 403 Forbidden to trigger an IOException in Java's HttpURLConnection.
    // The legacy APK's catch block immediately calls openExternalUrl() to open this in the device browser!
    return new Response('Browser navigation required', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  // Any real browser opening this link gets smoothly redirected to the official website homepage!
  return Response.redirect('https://www.cinevaultapk.online/', 301);
}
