import * as crypto from 'crypto';

const secretKey = 'a4f9b11e0f184d9ab70a226b50922f43'; // 32 bytes (256 bits)
const iv = '3c1bfa9c59a14131';
export function encryptVdcPassword(value: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey, 'utf8'),
    Buffer.from(iv, 'utf8'),
  );
  let encryptedValue = cipher.update(value, 'utf-8', 'hex');
  encryptedValue += cipher.final('hex');
  return encryptedValue;
}

export function decryptVdcPassword(encryptedValue: string): string {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey, 'utf8'),
      Buffer.from(iv, 'utf8'),
    );
    let decryptedValue = decipher.update(encryptedValue, 'hex', 'utf-8');
    decryptedValue += decipher.final('utf-8');
    return decryptedValue;
  } catch (e) {
    return encryptedValue;
  }
}
