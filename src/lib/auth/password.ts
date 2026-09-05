import * as argon2 from "argon2";

// Argon2id: current OWASP-recommended default for password hashing.
export async function hashPassword(plainPassword: string): Promise<string> {
  return argon2.hash(plainPassword, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    // Malformed hash, etc. - treat as invalid rather than throwing.
    return false;
  }
}
