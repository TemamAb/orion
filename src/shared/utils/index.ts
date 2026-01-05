import { ethers } from 'ethers';

// Validation Utilities
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const isValidPrivateKey = (key: string): boolean => {
  try {
    new ethers.Wallet(key);
    return true;
  } catch {
    return false;
  }
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Formatting Utilities
export const formatAddress = (address: string): string => {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatCurrency = (amount: string | number, currency = 'USD'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Time Utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

// Array Utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// Object Utilities
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Crypto Utilities
export const generateRandomBytes = (length: number): Uint8Array => {
  return ethers.randomBytes(length);
};

export const hashString = (str: string): string => {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
};

// Environment Utilities
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
};

export const getEnvVarAsNumber = (key: string, defaultValue?: number): number => {
  const value = getEnvVar(key, defaultValue?.toString());
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
};

export const getEnvVarAsBoolean = (key: string, defaultValue = false): boolean => {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
};

// Logging Utilities
export const createLogger = (service: string) => {
  return {
    info: (message: string, meta?: any) => {
      console.log(`[${service}] INFO: ${message}`, meta || '');
    },
    warn: (message: string, meta?: any) => {
      console.warn(`[${service}] WARN: ${message}`, meta || '');
    },
    error: (message: string, error?: any) => {
      console.error(`[${service}] ERROR: ${message}`, error || '');
    },
    debug: (message: string, meta?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[${service}] DEBUG: ${message}`, meta || '');
      }
    },
  };
};

// Retry Utilities
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt < maxRetries) {
        await sleep(baseDelay * attempt);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};
