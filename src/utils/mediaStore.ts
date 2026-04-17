/**
 * IndexedDB-based media storage for photos and videos.
 * Stores files as raw Blobs (no quality loss, supports large files).
 * Media is referenced by ID with the prefix "idb://"
 */

const DB_NAME = 'noya-game-media';
const DB_VERSION = 1;
const STORE_NAME = 'media';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface MediaEntry {
  id: string;
  blob: Blob;
  type: string; // MIME type
  name: string; // original filename
}

/** Save a file to IndexedDB. Returns the idb:// reference URL. */
export async function saveMedia(file: File): Promise<string> {
  const id = `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const entry: MediaEntry = {
      id,
      blob: file,
      type: file.type,
      name: file.name,
    };
    const request = store.put(entry);
    request.onsuccess = () => resolve(`idb://${id}`);
    request.onerror = () => reject(request.error);
  });
}

/** Load a media entry from IndexedDB by its ID. */
export async function loadMedia(id: string): Promise<MediaEntry | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/** Delete a media entry from IndexedDB. */
export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** Check if a URL is an IndexedDB reference. */
export function isIdbUrl(url: string): boolean {
  return url.startsWith('idb://');
}

/** Extract the media ID from an idb:// URL. */
export function getIdbId(url: string): string {
  return url.replace('idb://', '');
}

/** Convert an idb:// URL to a base64 data URI for export. Returns original url if not idb. */
export async function idbUrlToBase64(url: string): Promise<string> {
  if (!isIdbUrl(url)) return url;
  const entry = await loadMedia(getIdbId(url));
  if (!entry) return url;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(entry.blob);
  });
}

/** Save a base64 data URI to IndexedDB and return an idb:// reference. Returns original url if not base64. */
export async function base64ToIdbUrl(dataUri: string, filename = 'imported'): Promise<string> {
  if (!dataUri.startsWith('data:')) return dataUri;
  const mimeMatch = dataUri.match(/^data:([^;]+);base64,/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const base64 = dataUri.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const file = new File([blob], filename, { type: mime });
  return saveMedia(file);
}
