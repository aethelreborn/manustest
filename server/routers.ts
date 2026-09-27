import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const vaultPayloadSchema = z.object({
  title: z.string().trim().min(1).max(255),
  itemType: z.enum(["password", "card", "note"]),
  encryptedPayload: z.string().min(1).max(10000),
  iv: z.string().min(16).max(64),
});
const billingPayloadSchema = z.object({
  title: z.string().trim().min(1).max(255),
  amount: z.number().int().nonnegative().max(100000000),
  currency: z.string().length(3).default("INR"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cadence: z.enum(["Monthly", "Yearly", "One-time"]),
  status: z.enum(["upcoming", "overdue", "paid"]).default("upcoming"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  vault: router({
    list: protectedProcedure.query(({ ctx }) => db.listVaultItems(ctx.user.id)),
    create: protectedProcedure.input(vaultPayloadSchema).mutation(({ ctx, input }) => db.createVaultItem({ ...input, userId: ctx.user.id })),
    update: protectedProcedure.input(vaultPayloadSchema.partial().extend({ id: z.number().int().positive() })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateVaultItem(ctx.user.id, id, data);
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => db.deleteVaultItem(ctx.user.id, input.id)),
  }),
  billing: router({
    list: protectedProcedure.query(({ ctx }) => db.listBillingItems(ctx.user.id)),
    create: protectedProcedure.input(billingPayloadSchema).mutation(({ ctx, input }) => db.createBillingItem({ ...input, userId: ctx.user.id })),
    update: protectedProcedure.input(billingPayloadSchema.partial().extend({ id: z.number().int().positive() })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateBillingItem(ctx.user.id, id, data);
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => db.deleteBillingItem(ctx.user.id, input.id)),
  }),
});
export type AppRouter = typeof appRouter;
