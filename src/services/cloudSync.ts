/**
 * Cloud sync service using Firebase Firestore + Storage.
 * Falls back to local-only mode if Firebase is not configured.
 */
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase';
import { AdminState } from '../types';
import { isIdbUrl, loadMedia, getIdbId } from '../utils/mediaStore';

const GAME_DOC = 'noya-game/data';

type SyncableData = Pick<AdminState, 'questions' | 'persons' | 'correctAnswerAudioUrl' | 'questionRevealAudioUrl'>;

/** Upload a file Blob to Firebase Storage and return its download URL */
async function uploadToStorage(blob: Blob, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await new Promise<void>((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob);
    task.on('state_changed', undefined, reject, () => resolve());
  });
  return getDownloadURL(storageRef);
}

/** Resolve an idb:// URL to a Firebase Storage URL (uploading if needed) */
async function resolveMediaUrl(url: string): Promise<string> {
  if (!url || !isIdbUrl(url)) return url;
  const id = getIdbId(url);
  const entry = await loadMedia(id);
  if (!entry) return url;
  const ext = entry.name.split('.').pop() || 'bin';
  const path = `media/${id}.${ext}`;
  try {
    return await uploadToStorage(entry.blob, path);
  } catch {
    return url; // fallback to local if upload fails
  }
}

/** Save game data to Firestore, uploading any local media to Storage first */
export async function saveToCloud(data: SyncableData): Promise<void> {
  if (!isFirebaseConfigured) return;

  const resolvedQuestions = await Promise.all(
    data.questions.map(async (q) => ({
      ...q,
      imageUrl: await resolveMediaUrl(q.imageUrl),
      videoUrl: await resolveMediaUrl(q.videoUrl),
    }))
  );

  const resolvedPersons = await Promise.all(
    data.persons.map(async (p) => ({
      ...p,
      avatarUrl: await resolveMediaUrl(p.avatarUrl),
    }))
  );

  const payload = {
    questions: resolvedQuestions,
    persons: resolvedPersons,
    correctAnswerAudioUrl: await resolveMediaUrl(data.correctAnswerAudioUrl),
    questionRevealAudioUrl: await resolveMediaUrl(data.questionRevealAudioUrl),
    updatedAt: Date.now(),
  };

  const [collection, docId] = GAME_DOC.split('/');
  await setDoc(doc(db, collection, docId), payload);
}

/** Load game data from Firestore once */
export async function loadFromCloud(): Promise<SyncableData | null> {
  if (!isFirebaseConfigured) return null;
  const [collection, docId] = GAME_DOC.split('/');
  const snap = await getDoc(doc(db, collection, docId));
  if (!snap.exists()) return null;
  return snap.data() as SyncableData;
}

/** Subscribe to real-time updates from Firestore */
export function subscribeToCloud(callback: (data: SyncableData) => void): () => void {
  if (!isFirebaseConfigured) return () => {};
  const [collection, docId] = GAME_DOC.split('/');
  return onSnapshot(doc(db, collection, docId), (snap) => {
    if (snap.exists()) callback(snap.data() as SyncableData);
  });
}
