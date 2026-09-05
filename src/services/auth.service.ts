import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession, getCurrentAdmin } from "@/lib/auth/session";
import { AuthenticationError } from "@/lib/errors";
import type { LoginInput } from "@/lib/validations/auth.validation";

export const authService = {
  async login(input: LoginInput) {
    const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

    // Same error for "no such user" and "wrong password" - don't leak
    // which one it was.
    if (!user) throw new AuthenticationError("Invalid email or password");

    const passwordValid = await verifyPassword(user.passwordHash, input.password);
    if (!passwordValid) throw new AuthenticationError("Invalid email or password");

    await createSession(user.id);

    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  },

  async logout() {
    await deleteSession();
  },

  async me() {
    return getCurrentAdmin();
  },

  /** Used by the seed script only - never exposed via an API route. */
  async hashPasswordForSeed(plainPassword: string) {
    return hashPassword(plainPassword);
  }
};
