// utils/fingerprint.ts

function getFingerprint(): string {
  if (typeof window === "undefined") return "server"; // SSR/Node

  // Gabungkan info umum browser
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset(),
    window.devicePixelRatio,
    navigator.platform,
    navigator.hardwareConcurrency,
  ].join("::");

  // Hash sederhana
  let hash = 0, i, chr;
  for (i = 0; i < data.length; i++) {
    chr = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return "fp_" + Math.abs(hash);
}

export default getFingerprint;

