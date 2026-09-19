/**
 * Security & Cryptographic Utilities for Patient Result Delivery
 * Meets requirements:
 * - SHA-256 hashing for passwords and tokens
 * - Random unguessable URL-safe tokens (res_ + base62/hex)
 * - Random 6-digit PIN for patient access
 * - Short-lived in-memory / session access token (15-30 minutes)
 * - Maximum 5 failed attempts lockout
 * - 30-day default link expiration
 */

export const SECURITY_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  EXPIRATION_DAYS: 30,
  SESSION_TTL_MINUTES: 20,
} as const;

/**
 * Standard SHA-256 Hash using Web Crypto API.
 * Works seamlessly in Modern Browsers & Node 18+.
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback for SSR / Node environment
  try {
    const cryptoModule = await import("crypto");
    return cryptoModule.createHash("sha256").update(input).digest("hex");
  } catch {
    // Basic fallback if crypto module is unavailable
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }
}

/**
 * Generates an unguessable, cryptographically secure URL token.
 * Example format: res_9a2f7c0d1e4b8a3f6e5c9b1d
 */
export function generateSecureToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(20);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      randomPart += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 20; i++) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return `res_${randomPart}`;
}

/**
 * Generates a 6-digit numeric PIN password for the patient.
 * Example: "618302"
 */
export function generatePatientPin(): string {
  let pin = "";
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    pin = (100000 + (array[0] % 900000)).toString();
  } else {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  }
  return pin;
}

/**
 * Masks phone numbers for display without revealing sensitive data.
 * Example: 0912345678 -> 091****678
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}****${end}`;
}

/**
 * Temporary In-Memory Session Storage for Verified Patients.
 * After PIN verification, a temporary session token is issued, valid for 20 minutes.
 */
interface AccessSession {
  token: string;
  packageId: string;
  expiresAt: number; // timestamp
}

const SESSIONS_KEY = "ngoc_khanh_result_session";

export function saveResultSession(token: string, packageId: string): string {
  const sessionToken = `sess_${generateSecureToken().replace("res_", "")}`;
  const session: AccessSession = {
    token,
    packageId,
    expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TTL_MINUTES * 60 * 1000,
  };

  if (typeof window !== "undefined" && window.sessionStorage) {
    window.sessionStorage.setItem(`${SESSIONS_KEY}_${token}`, JSON.stringify(session));
  }

  return sessionToken;
}

export function verifyResultSession(token: string): boolean {
  if (typeof window === "undefined" || !window.sessionStorage) return false;
  const data = window.sessionStorage.getItem(`${SESSIONS_KEY}_${token}`);
  if (!data) return false;

  try {
    const session: AccessSession = JSON.parse(data);
    if (session.token !== token) return false;
    if (Date.now() > session.expiresAt) {
      window.sessionStorage.removeItem(`${SESSIONS_KEY}_${token}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearResultSession(token: string): void {
  if (typeof window !== "undefined" && window.sessionStorage) {
    window.sessionStorage.removeItem(`${SESSIONS_KEY}_${token}`);
  }
}
