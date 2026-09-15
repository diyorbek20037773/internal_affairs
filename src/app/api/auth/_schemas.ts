import { z } from "zod";

export const BadgeSchema = z.string().trim().min(2).max(32).transform((s) => s.toUpperCase());
export const PinSchema = z.string().regex(/^\d{4,8}$/, "pin must be 4-8 digits");

export const LoginSchema = z.object({ badgeId: BadgeSchema, pin: PinSchema });
export const RegisterSchema = LoginSchema.extend({
  name: z.string().trim().min(2).max(120),
  rank: z.string().trim().max(60).default(""),
  district: z.string().trim().max(160).default(""),
});
