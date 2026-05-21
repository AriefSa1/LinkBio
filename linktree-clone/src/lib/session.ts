import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error("AUTH_SECRET belum di-set di file .env");
}
const encodedKey = new TextEncoder().encode(secret);

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export type SessionPayload = {
  userId: string;
  username: string;
};

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return { userId: payload.userId as string, username: payload.username as string };
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}
