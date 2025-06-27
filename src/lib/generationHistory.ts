import { openDB, type DBSchema } from 'idb';

export interface Generation {
  id: string;
  timestamp: number;
  style: string;
  quality: string;
  results: Array<{
    url: string;
    promptName: string;
    quality?: string;
  }>;
}

interface GenerationDB extends DBSchema {
  generations: {
    key: string;
    value: {
      id: string;
      timestamp: number;
      style: string;
      quality: string;
      results: Array<{
        imageBlob: Blob;
        promptName: string;
        quality?: string;
      }>;
    };
  };
}

const DB_NAME = 'petMemoriesHistory';
const DB_VERSION = 1;

// Convert base64 data URL to Blob (smaller storage)
const base64ToBlob = (base64: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  return new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
};

// Convert Blob back to data URL
const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// Open IndexedDB connection
const openDatabase = async () => {
  return openDB<GenerationDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('generations')) {
        db.createObjectStore('generations', { keyPath: 'id' });
      }
    },
  });
};

// Save generation to IndexedDB
export const saveGeneration = async (generation: Generation): Promise<void> => {
  try {
    const db = await openDatabase();
    
    // Convert base64 URLs to Blobs for efficient storage
    const generationWithBlobs = {
      ...generation,
      results: generation.results.map(result => ({
        ...result,
        imageBlob: base64ToBlob(result.url),
        url: undefined, // Remove large base64 URL
      })),
    };

    await db.add('generations', generationWithBlobs);
    
    // Keep only latest 20 generations
    const allGenerations = await db.getAll('generations');
    if (allGenerations.length > 20) {
      const sorted = allGenerations.sort((a, b) => b.timestamp - a.timestamp);
      const toDelete = sorted.slice(20);
      
      for (const gen of toDelete) {
        await db.delete('generations', gen.id);
      }
    }
  } catch (error) {
    console.error('Failed to save generation to IndexedDB:', error);
    throw error;
  }
};

// Load generations from IndexedDB
export const loadGenerations = async (): Promise<Generation[]> => {
  try {
    const db = await openDatabase();
    const stored = await db.getAll('generations');
    
    // Convert Blobs back to data URLs and sort by timestamp
    const generations: Generation[] = [];
    
    for (const gen of stored) {
      const results = [];
      for (const result of gen.results) {
        const dataURL = await blobToDataURL(result.imageBlob);
        results.push({
          ...result,
          url: dataURL,
        });
      }
      
      generations.push({
        ...gen,
        results,
      });
    }
    
    return generations.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load generations from IndexedDB:', error);
    return [];
  }
};