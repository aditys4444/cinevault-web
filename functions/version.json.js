export async function onRequest(context) {
  const responseData = {
    version: "2.5.0",
    versionCode: 2500,
    releaseDate: "2026-09-22",
    changelog: [
      "Fixed video player landscape mode to fit full device frame",
      "Instant touch response time and optimized navigation speed",
      "Stream pre-warming and non-blocking background caching",
      "Cinema-grade 4K HDR & AV1 hardware decoding",
      "65+ Live TV channels with low-latency HLS"
    ],
    apkUrl: "https://cinevaultapk.online/downloads/CineVault.apk",
    websiteUrl: "https://cinevaultapk.online/",
    mandatory: true,
    minVersion: "2.5.0",
    sha256: "0841558f9f004408eff659280213b1e55d4fef25845590b04659f0d48605795f",
    fileSizeBytes: 9209090,
    fileSizeMB: "8.8MB"
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