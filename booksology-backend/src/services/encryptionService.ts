import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-cbc';

  generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  encrypt(data: Buffer, key: string): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(key, 'hex'), iv);
    return Buffer.concat([iv, cipher.update(data), cipher.final()]);
  }

  decrypt(encryptedData: Buffer, key: string): Buffer {
    const iv = encryptedData.subarray(0, 16);
    const encryptedContent = encryptedData.subarray(16);
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(key, 'hex'), iv);
    return Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
  }
}

export default new EncryptionService();