import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { User } from '@/types';

// Session configuration
const sessionConfig = {
  cookieName: 'fixd_session',
  password: process.env.SESSION_SECRET || 'default-password-change-in-production',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

/**
 * Session data structure
 */
export interface IronSession {
  user?: User & { phoneNumber: string };
  isAuthenticated: boolean;
}

/**
 * Get current session
 */
export async function getSession(): Promise<IronSession> {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSession>(cookieStore, sessionConfig);

  return session;
}

/**
 * Set user session
 */
export async function setSession(user: User & { phoneNumber: string }): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSession>(cookieStore, sessionConfig);

  session.user = user;
  session.isAuthenticated = true;

  await session.save();
}

/**
 * Destroy session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSession>(cookieStore, sessionConfig);

  session.user = undefined;
  session.isAuthenticated = false;

  await session.save();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAuthenticated ?? false;
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<(User & { phoneNumber: string }) | null> {
  const session = await getSession();
  return session.user || null;
}
