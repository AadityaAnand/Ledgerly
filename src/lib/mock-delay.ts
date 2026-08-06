/**
 * Simulates network latency for the mock data layer so loading states are
 * exercised the same way they will be once these calls hit a real API.
 * Every function in src/services returns a Promise for this reason — the
 * mock layer can be swapped for `fetch` calls later without touching
 * anything that consumes these services.
 */
export function mockDelay<T>(data: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
