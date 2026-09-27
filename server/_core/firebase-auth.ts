import { createRemoteJWKSet, jwtVerify } from "jose";
import { firebaseServerProjectId } from "../../constants/firebase";

const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

export type FirebaseClaims = { uid: string; email?: string; name?: string; picture?: string; email_verified?: boolean };

export async function verifyFirebaseIdToken(token: string): Promise<FirebaseClaims> {
  const { payload } = await jwtVerify(token, googleKeys, { issuer: `https://securetoken.google.com/${firebaseServerProjectId}`, audience: firebaseServerProjectId });
  const uid = typeof payload.user_id === "string" ? payload.user_id : typeof payload.sub === "string" ? payload.sub : "";
  if (!uid) throw new Error("Firebase token has no user id");
  return { uid, email: typeof payload.email === "string" ? payload.email : undefined, name: typeof payload.name === "string" ? payload.name : undefined, picture: typeof payload.picture === "string" ? payload.picture : undefined, email_verified: payload.email_verified === true };
}
