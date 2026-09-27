import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";
import { verifyFirebaseIdToken } from "./firebase-auth";

export type TrpcContext = { req: CreateExpressContextOptions["req"]; res: CreateExpressContextOptions["res"]; user: User | null };
export function firebaseUserOpenId(uid: string) { return `firebase:${uid}`; }

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;
  const authorization = opts.req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    try {
      const claims = await verifyFirebaseIdToken(authorization.slice("Bearer ".length));
      const openId = firebaseUserOpenId(claims.uid);
      await upsertUser({ openId, name: claims.name ?? null, email: claims.email ?? null, loginMethod: "google" });
      user = (await getUserByOpenId(openId)) ?? null;
    } catch {
      user = null;
    }
  }
  return { req: opts.req, res: opts.res, user };
}
