/** Stack Exchange API key. */
export const SE_API_KEY = 'rl_mFTLDz37Fhzc4mSfKqnUJD6Aa';

/**
 * Get the StackExchange's authentication key. Available in content scripts.
 * @throws {Error} If the key is not found.
 */
export function getFkey() {
  const [fkey, expires] = localStorage.getItem('se:fkey')?.split(',') ?? [];
  if (!fkey || Date.now() <= Number(expires ?? 0) * 1000)
    throw new Error('Unable to get fkey, maybe StackExchange refactored their code.');
  return fkey;
}
