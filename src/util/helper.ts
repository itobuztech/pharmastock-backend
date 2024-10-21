import { randomBytes } from 'crypto';

export async function generateToken() {
  // Generate random bytes
  const buffer = randomBytes(32 / 2);
  // Convert to hex string
  return await buffer.toString('hex');
}

export async function generateLotName() {
  // Generate random bytes
  const buffer = randomBytes(18 / 2);
  // Convert to hex string
  return await buffer.toString('hex');
}

export async function generateInvitePassword() {
  // Generate random bytes
  const buffer = randomBytes(12 / 2);
  // Convert to hex string
  return await buffer.toString('hex');
}
