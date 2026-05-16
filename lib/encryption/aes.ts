import CryptoJS from 'crypto-js';

const getEncryptionKey = (): string => {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-this-immediately';
  if (key === 'default-key-change-this-immediately') {
    console.warn('⚠️ Using default encryption key. Please set NEXT_PUBLIC_ENCRYPTION_KEY in .env.local');
  }
  return key;
};

export const encryptData = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, getEncryptionKey()).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, getEncryptionKey()).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
