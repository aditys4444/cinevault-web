export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);
  const pathname = url.pathname.toLowerCase();
  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
  const method = req.method.toUpperCase();

  // 1. Restrict HTTP Methods: only allow GET, HEAD, and OPTIONS on public site
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 2. Edge WAF: Block known automated attack scanners
  const badScanners = [
    'sqlmap', 'nikto', 'masscan', 'gobuster', 'dirbuster',
    'nuclei', 'wpscan', 'acunetix', 'nessus', 'zgrab', 'havij'
  ];
  if (badScanners.some(scanner => userAgent.includes(scanner))) {
    return new Response('Access Denied: Automated scan detected', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 3. Edge WAF: Block probe attempts for sensitive files and admin endpoints
  const blockedPatterns = [
    '/.git', '/.env', '/.aws', '/.ssh', '/.vscode', '/.idea',
    '/wp-admin', '/wp-login', '/wp-content', '/xmlrpc.php',
    '/phpmyadmin', '/pma', '/adminer', '/config.json',
    '/eval-stdin.php', '/cgi-bin/', '/shell', '/.bash_history'
  ];
  if (blockedPatterns.some(pattern => pathname.startsWith(pattern) || pathname.includes(pattern))) {
    return new Response('Forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 4. Short direct download route for FireStick / Downloader app
  if (url.pathname === '/apk' || url.pathname === '/dl') {
    return Response.redirect('https://www.cinevaultapk.online/downloads/CineVault.apk', 302);
  }

  // 5. If request hits non-www apex domain (cinevaultapk.online), permanently 301 redirect to www.cinevaultapk.online
  if (url.hostname === 'cinevaultapk.online') {
    url.hostname = 'www.cinevaultapk.online';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return await context.next();
}
