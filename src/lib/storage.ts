import { env } from '../config/env';

export interface StorageProvider {
  getSignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
}

class MockStorageProvider implements StorageProvider {
  async getSignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    // In dev, fileKey is already '/uploads/filename.pdf', so we just return the local server URL
    return `http://localhost:5000${fileKey}`;
  }
}

// Instantiate the appropriate provider
export const storage = new MockStorageProvider();
