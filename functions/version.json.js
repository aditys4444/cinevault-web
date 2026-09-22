export async function onRequest(context) {
  const responseData = {
    version: "2.5.1",
    versionCode: 2510,
    releaseDate: "2026-09-22",
    changelog: [
      "Fixed video player zoomed-in display in portrait mode",
      "Fixed landscape screen fit not properly applying when toggling fit modes",
      "Video player now auto-resets to proper fit when switching between portrait and landscape",
      "Performance improvements and stability fixes"
    ],
    apkUrl: "https://cinevaultapk.online/downloads/CineVault.apk",
    websiteUrl: "https://cinevaultapk.online/",
    mandatory: true,
    minVersion: "2.0.0",
    sha256: "c8b7f12873a2d126f629fd6985617ac9cddbc6a6b66fe24ad919f6a912be3c6c",
    fileSizeBytes: 9164960,
    fileSizeMB: "8.7MB"
  };

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  return new Response(JSON.stringify(responseData), { status: 200, headers });
}
