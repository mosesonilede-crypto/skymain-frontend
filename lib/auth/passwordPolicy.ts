/**
 * Server-side password policy enforcement.
 *
 * Validates passwords against enterprise-grade requirements before
 * passing to Supabase Auth. Prevents weak passwords at the API layer.
 *
 * Usage:
 *   import { validatePassword } from "@/lib/auth/passwordPolicy";
 *   const result = validatePassword("P@ssw0rd123!");
 *   if (!result.valid) return Response.json({ errors: result.errors }, { status: 400 });
 */

export type PasswordPolicyResult = {
  valid: boolean;
  score: number; // 0-5 strength score
  errors: string[];
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 128;

// Common leaked passwords (top subset - in production use HaveIBeenPwned API)
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "123456", "12345678",
  "qwerty", "abc123", "monkey", "letmein", "dragon",
  "master", "iloveyou", "admin", "welcome", "login",
  "princess", "football", "shadow", "sunshine", "trustno1",
  "passw0rd", "p@ssword", "p@ssw0rd", "changeme",
]);

export function validatePassword(
  password: string,
  email?: string
): PasswordPolicyResult {
  const errors: string[] = [];
  let score = 0;

  // Length checks
  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters`);
  } else {
    score += 1;
  }

  if (password.length > MAX_LENGTH) {
    errors.push(`Password must be at most ${MAX_LENGTH} characters`);
  }

  // Character class checks
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain at least one digit");
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Must contain at least one special character (!@#$%^&* etc.)");
  } else {
    score += 1;
  }

  // Blocklist check
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common. Choose a more unique password.");
    score = 0;
  }

  // Repetitive patterns (e.g., aaaa, 1111)
  if (/(.)\1{3,}/.test(password)) {
    errors.push("Password contains too many repeated characters");
    score = Math.max(0, score - 1);
  }

  // Sequential patterns (e.g., abcd, 1234)
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    errors.push("Password contains sequential characters");
    score = Math.max(0, score - 1);
  }

  // Email substring check
  if (email) {
    const localPart = email.split("@")[0].toLowerCase();
    if (localPart.length >= 3 && password.toLowerCase().includes(localPart)) {
      errors.push("Password must not contain your email username");
      score = Math.max(0, score - 1);
    }
  }

  return {
    valid: errors.length === 0,
    score,
    errors,
  };
}

/**
 * Returns a human-readable strength label.
 */
export function getPasswordStrength(score: number): string {
  if (score <= 1) return "Very Weak";
  if (score <= 2) return "Weak";
  if (score <= 3) return "Fair";
  if (score <= 4) return "Strong";
  return "Very Strong";
}
