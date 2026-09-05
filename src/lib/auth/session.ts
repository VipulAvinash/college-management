import "dotenv/config";
import { cookies } from "next/headers";
import { eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type PublicUser } from "@/db/schema";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export const SESSION_COOKIE_NAME = "session_id";
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7);

function toPublicUser(user: typeof users.$inferSelect): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

/** Creates a DB session row and sets the HTTP-only session cookie. */
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const [session] = await db
    .insert(sessions)
    .values({ userId, expiresAt })
    .returning();

  if (!session) {
    throw new Error("Failed to create session record");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });

  return session;
}

/** Deletes the current session (both the DB row and the cookie). */
export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Resolves the current session cookie to an admin user, or null.
 * Also lazily prunes the session if it has expired.
 */
export async function getCurrentAdmin(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const row = result[0];
  if (!row) return null;

  if (row.session.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return toPublicUser(row.user);
}

/** Throws 401 if there is no valid session. Use at the top of every admin route/service call. */
export async function requireAdmin(): Promise<PublicUser> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new AuthenticationError();
  }
  if (admin.role !== "ADMIN") {
    // Defensive: currently the only role is ADMIN, but this keeps the
    // check explicit for when more roles are introduced later.
    throw new AuthorizationError();
  }
  return admin;
}

/** Best-effort cleanup of expired sessions. Safe to call periodically (e.g. from a cron or on login). */
export async function pruneExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
