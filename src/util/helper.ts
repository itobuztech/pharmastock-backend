import { randomBytes } from 'crypto';

export async function generateToken() {
  // Generate random bytes
  const buffer = randomBytes(32 / 2);
  // Convert to hex string
  return await buffer.toString('hex');
}
