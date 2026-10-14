export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Short direct download route for FireStick / Downloader app
  if (url.pathname === '/apk' || url.pathname === '/dl') {
    return Response.redirect('https://www.cinevaultapk.online/downloads/CineVault.apk', 302);
  }

  // If request hits non-www apex domain (cinevaultapk.online), permanently 301 redirect to www.cinevaultapk.online
  if (url.hostname === 'cinevaultapk.online') {
    url.hostname = 'www.cinevaultapk.online';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return await context.next();
}
