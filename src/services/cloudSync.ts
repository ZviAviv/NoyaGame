import { supabase } from '../supabase';
import { AdminState } from '../types';
import { isIdbUrl, loadMedia, getIdbId } from '../utils/mediaStore';

type SyncableData = Pick<AdminState, 'questions' | 'persons' | 'correctAnswerAudioUrl' | 'questionRevealAudioUrl'>;

/** Upload a file Blob to Supabase Storage and return its public URL */
async function uploadToStorage(blob: Blob, path: string): Promise<string> {
  const { error } = await supabase.storage.from('media').upload(path, blob, {
    upsert: true,
    contentType: blob.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

/** Resolve an idb:// URL to a Supabase Storage URL (uploading if needed) */
async function resolveMediaUrl(url: string): Promise<string> {
  if (!url || !isIdbUrl(url)) return url;
  const id = getIdbId(url);
  const entry = await loadMedia(id);
  if (!entry) return url;
  const ext = entry.name.split('.').pop() || 'bin';
  const path = `${id}.${ext}`;
  try {
    return await uploadToStorage(entry.blob, path);
  } catch {
    return url;
  }
}

/** Save game data to Supabase, uploading any local media to Storage first */
export async function saveToCloud(data: SyncableData): Promise<void> {
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

  const { error } = await supabase.from('game_data').upsert({
    id: 'main',
    questions: resolvedQuestions,
    persons: resolvedPersons,
    correct_answer_audio_url: await resolveMediaUrl(data.correctAnswerAudioUrl),
    question_reveal_audio_url: await resolveMediaUrl(data.questionRevealAudioUrl),
    updated_at: new Date().toISOString(),
  });

  if (error) console.error('Cloud save failed:', error);
}

/** Load game data from Supabase once */
export async function loadFromCloud(): Promise<SyncableData | null> {
  const { data, error } = await supabase
    .from('game_data')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error || !data) return null;
  return {
    questions: data.questions || [],
    persons: data.persons || [],
    correctAnswerAudioUrl: data.correct_answer_audio_url || '',
    questionRevealAudioUrl: data.question_reveal_audio_url || '',
  };
}

/** Subscribe to real-time updates */
export function subscribeToCloud(callback: (data: SyncableData) => void): () => void {
  const channel = supabase
    .channel('game_data_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'game_data', filter: 'id=eq.main' },
      (payload) => {
        const row = payload.new as Record<string, unknown>;
        callback({
          questions: (row.questions as SyncableData['questions']) || [],
          persons: (row.persons as SyncableData['persons']) || [],
          correctAnswerAudioUrl: (row.correct_answer_audio_url as string) || '',
          questionRevealAudioUrl: (row.question_reveal_audio_url as string) || '',
        });
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
