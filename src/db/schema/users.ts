import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoleEnum } from "./enums";
import { sessions } from "./sessions";

// ONLY administrators live in this table. Students/faculty are plain
// records elsewhere and are intentionally NOT linked to `users`.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("ADMIN"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions)
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
// Shape safe to ever send to a client - never spread `users` rows directly.
export type PublicUser = Omit<User, "passwordHash">;
