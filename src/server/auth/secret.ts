import { randomBytes } from 'node:crypto';

/**
 * 生成秘钥
 */
export function generateFormattedSecret(): string {
  const bytes = randomBytes(32);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 生成32个随机字符
  let result = '';
  for (let i = 0; i < 32; i++) {
    const randomIndex = bytes[i] % chars.length;
    result += chars[randomIndex];
  }
  return result.match(/.{4}/g)!.join('-');
}
