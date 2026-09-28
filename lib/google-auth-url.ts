export function buildGoogleAuthUrl(clientId: string, redirectUri: string, nonce: string) {
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${encodeURIComponent("openid profile email")}&nonce=${encodeURIComponent(nonce)}`;
}

export function readGoogleIdToken(callbackUrl: string) {
  const fragment = callbackUrl.split("#")[1] ?? callbackUrl.split("?")[1] ?? "";
  const token = fragment.split("&").find((part) => part.startsWith("id_token="))?.slice("id_token=".length);
  return token ? decodeURIComponent(token) : null;
}
