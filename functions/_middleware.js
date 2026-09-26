export async function onRequest(context) {
  const url = new URL(context.request.url);

  // If request hits non-www apex domain (cinevaultapk.online), permanently 301 redirect to www.cinevaultapk.online
  if (url.hostname === 'cinevaultapk.online') {
    url.hostname = 'www.cinevaultapk.online';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return await context.next();
}
