import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const vaultItems = mysqlTable("vault_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  itemType: mysqlEnum("itemType", ["password", "card", "note"]).notNull(),
  encryptedPayload: text("encryptedPayload").notNull(),
  iv: varchar("iv", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const billingItems = mysqlTable("billing_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  dueDate: varchar("dueDate", { length: 10 }).notNull(),
  cadence: mysqlEnum("cadence", ["Monthly", "Yearly", "One-time"]).notNull(),
  status: mysqlEnum("status", ["upcoming", "overdue", "paid"]).default("upcoming").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type VaultItem = typeof vaultItems.$inferSelect;
export type InsertVaultItem = typeof vaultItems.$inferInsert;
export type BillingItem = typeof billingItems.$inferSelect;
export type InsertBillingItem = typeof billingItems.$inferInsert;
