import { openDB } from 'idb';

const DB_NAME = 'kaia-coach-db';
const DB_VERSION = 1;
const STORE_NAME = 'chat-history';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
}

export async function saveMessage(message) {
  const db = await initDB();
  return db.add(STORE_NAME, message);
}

export async function getChatHistory() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function clearChatHistory() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}

export async function saveSettings(settings) {
  const db = await initDB();
  if (!db.objectStoreNames.contains('settings')) {
    db.createObjectStore('settings', { keyPath: 'key' });
  }
  return db.put('settings', settings);
}

export async function getSettings() {
  const db = await initDB();
  return db.get('settings', 'user-preferences');
}
