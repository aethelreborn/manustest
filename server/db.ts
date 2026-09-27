import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { billingItems, type InsertBillingItem, type InsertUser, type InsertVaultItem, users, vaultItems } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"), lastSignedIn: user.lastSignedIn ?? new Date() };
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name, email: values.email, loginMethod: values.loginMethod, role: values.role, lastSignedIn: values.lastSignedIn } });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listVaultItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vaultItems).where(eq(vaultItems.userId, userId)).orderBy(desc(vaultItems.updatedAt));
}

export async function createVaultItem(data: InsertVaultItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vaultItems).values(data);
  return result[0].insertId;
}

export async function updateVaultItem(userId: number, id: number, data: Partial<Pick<InsertVaultItem, "title" | "itemType" | "encryptedPayload" | "iv">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vaultItems).set(data).where(and(eq(vaultItems.id, id), eq(vaultItems.userId, userId)));
  return { success: true } as const;
}

export async function deleteVaultItem(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(vaultItems).where(and(eq(vaultItems.id, id), eq(vaultItems.userId, userId)));
  return { success: true } as const;
}

export async function listBillingItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(billingItems).where(eq(billingItems.userId, userId)).orderBy(billingItems.dueDate);
}

export async function createBillingItem(data: InsertBillingItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(billingItems).values(data);
  return result[0].insertId;
}

export async function updateBillingItem(userId: number, id: number, data: Partial<Pick<InsertBillingItem, "title" | "amount" | "currency" | "dueDate" | "cadence" | "status">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(billingItems).set(data).where(and(eq(billingItems.id, id), eq(billingItems.userId, userId)));
  return { success: true } as const;
}

export async function deleteBillingItem(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(billingItems).where(and(eq(billingItems.id, id), eq(billingItems.userId, userId)));
  return { success: true } as const;
}
