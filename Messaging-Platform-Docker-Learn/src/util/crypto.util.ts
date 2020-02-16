const config = require('../config/config');
const crypto = require('crypto');

const key = config.encryption.key;
const iv = config.encryption.iv;
const ALGORITHM = 'aes-256-cbc';

/**
 * Class responsible for data encryption and decryption
 */
export default class Crypto {
  // Encrypt input data
  public static encrypt(data: string, cypherKey: string) {
    const encryptionKey = this.getCypherKey(cypherKey);
    try {
      const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(key),
        encryptionKey
      );
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return encrypted.toString('hex');
    } catch (err) {
      throw new Error(err);
    }
  }

  // Decrypt cencrypted data
  public static decrypt(data: string, cypherKey: string) {
    const decryptionKey = this.getCypherKey(cypherKey);
    try {
      const encryptedText = Buffer.from(data, 'hex');
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(key),
        Buffer.from(decryptionKey)
      );
      const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString();
    } catch (err) {
      throw new Error(err);
    }
  }

  // Decrypt cencrypted data
  public static getCypherKey(cypherKey: string) {
    if (cypherKey && cypherKey.toString().length > 16) {
      return cypherKey.toString().slice(0, 16);
    } else {
      return iv;
    }
  }
}
