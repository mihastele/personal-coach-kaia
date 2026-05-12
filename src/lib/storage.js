import { openDB } from 'idb';

const DB_NAME = 'kaia-coach-db';
const DB_VERSION = 1;
const STORE_NAME = 'chat-history';

let dbInstance = null;

export async function initDB() {
  if (dbInstance) return dbInstance;
  
  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    // Return null to indicate storage is unavailable
    return null;
  }
}

export async function saveMessage(message) {
  try {
    const db = await initDB();
    if (!db) {
      console.warn('Storage unavailable, message not saved');
      return null;
    }
    return db.add(STORE_NAME, message);
  } catch (error) {
    console.error('Failed to save message:', error);
    return null;
  }
}

export async function getChatHistory() {
  try {
    const db = await initDB();
    if (!db) {
      console.warn('Storage unavailable, returning empty history');
      return [];
    }
    return db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
}

export async function clearChatHistory() {
  try {
    const db = await initDB();
    if (!db) {
      console.warn('Storage unavailable, cannot clear history');
      return null;
    }
    return db.clear(STORE_NAME);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
    return null;
  }
}

export async function saveSettings(settings) {
  try {
    const db = await initDB();
    if (!db) {
      console.warn('Storage unavailable, settings not saved');
      return null;
    }
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
    }
    return db.put('settings', settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    return null;
  }
}

export async function getSettings() {
  try {
    const db = await initDB();
    if (!db) {
      console.warn('Storage unavailable, returning default settings');
      return null;
    }
    return db.get('settings', 'user-preferences');
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}
