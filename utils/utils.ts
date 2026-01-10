// Utility helpers

/**
 * Normalize verification user object received from API to a consistent shape.
 * Prefer API-provided `userEmail`, `userName`, and `submittedAt` fields when present.
 */
export function normalizeVerificationUser<T extends Record<string, any>>(u: T) {
  if (!u) return u;
  return {
    ...u,
    email: u.userEmail ?? u.email,
    name: u.userName ?? u.name,
    createdAt: u.submittedAt ?? u.createdAt,
  } as any;
}



