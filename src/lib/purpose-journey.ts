import { z } from 'zod';
import { values } from '@/lib/purpose-values';
import type { StoredPhoto } from '@/lib/purpose-storage';

export const JOURNEY_KEY = 'purposelock.journey.v1';
export const JOURNEY_PHOTO_DB = 'purposelock.journey-photos.v1';

const valueName = z.string().refine(name => values.some(value => value.name === name));
const entrySchema = z.object({
  id: z.string().min(1).max(80),
  completedAt: z.string().refine(value => !Number.isNaN(Date.parse(value))),
  selected: z.array(valueName).min(1).max(9),
  action: z.string().min(1).max(500),
  thought: z.object({ values: z.array(z.string()).max(9), text: z.string().min(1).max(2000), attribution: z.string().refine((value: string): boolean => value === 'An original PurposeLock reflection') }),
  reflection: z.string().max(5000),
});
const intentionSchema = z.object({ text: z.string().trim().min(1).max(200), value: valueName, period: z.enum(['today', 'week']), setAt: z.string() });
const journeySchema = z.object({ version: z.literal(1), entries: z.array(entrySchema).max(200), intention: intentionSchema.nullable() });

export type JourneyEntryData = z.infer<typeof entrySchema>;
export type JourneyEntry = JourneyEntryData & { photos: StoredPhoto[] };
export type Intention = z.infer<typeof intentionSchema>;
export type JourneyState = { entries: JourneyEntry[]; intention: Intention | null };
export const emptyJourney: JourneyState = { entries: [], intention: null };

export function parseIntention(input: unknown): Intention { return intentionSchema.parse(input); }

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(JOURNEY_PHOTO_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('photos');
    request.onerror = () => reject(new Error('Journey photo storage unavailable'));
    request.onblocked = () => reject(new Error('Journey photo storage busy'));
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
}
function validPhotos(rows: unknown): rows is StoredPhoto[] {
  return Array.isArray(rows) && rows.every(row => row && row.blob instanceof Blob && row.blob.type.startsWith('image/') && row.blob.size <= 15 * 1024 * 1024 && typeof row.name === 'string');
}
async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore, done: (value: T) => void) => void): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction('photos', mode);
      let result: T;
      run(transaction.objectStore('photos'), value => { result = value; });
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = transaction.onabort = () => reject(new Error('Journey photo storage unavailable'));
    });
  } finally { db.close(); }
}

/** Reads the archive only when device-saving consent exists (the caller checks consent first). */
export async function loadJourney(): Promise<JourneyState> {
  const raw = localStorage.getItem(JOURNEY_KEY);
  if (!raw) return emptyJourney;
  const data = journeySchema.parse(JSON.parse(raw));
  const photos = await withStore<Record<string, StoredPhoto[]>>('readonly', (store, done) => {
    const out: Record<string, StoredPhoto[]> = {};
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) { done(out); return; }
      if (validPhotos(cursor.value)) out[String(cursor.key)] = cursor.value;
      cursor.continue();
    };
  });
  return { intention: data.intention, entries: data.entries.map(entry => ({ ...entry, photos: photos[entry.id] ?? [] })) };
}

// Entries are immutable once archived, so photo blobs are written once per entry id.
export function createJourneyStore() {
  let queue: Promise<unknown> = Promise.resolve();
  let generation = 0;
  return {
    save(state: JourneyState): Promise<boolean> {
      const token = generation;
      const work = queue.catch(() => {}).then(async () => {
        if (token !== generation) return false;
        const data = journeySchema.parse({ version: 1, intention: state.intention, entries: state.entries.map(({ photos: _photos, ...entry }) => entry) });
        const wanted = new Map(state.entries.map(entry => [entry.id, entry.photos]));
        await withStore<void>('readwrite', store => {
          const keys = store.getAllKeys();
          keys.onsuccess = () => {
            const existing = new Set(keys.result.map(String));
            existing.forEach(key => { if (!wanted.has(key)) store.delete(key); });
            wanted.forEach((photos, id) => { if (!existing.has(id)) store.put(photos.map(({ blob, name }) => ({ blob, name })), id); });
          };
        });
        if (token !== generation) return false;
        localStorage.setItem(JOURNEY_KEY, JSON.stringify(data));
        return true;
      });
      queue = work;
      return work;
    },
    clear(): Promise<void> {
      generation++;
      let removalError = false;
      try { localStorage.removeItem(JOURNEY_KEY); } catch { removalError = true; }
      const work = queue.catch(() => {}).then(async () => {
        await new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase(JOURNEY_PHOTO_DB);
          request.onsuccess = () => resolve();
          request.onerror = request.onblocked = () => reject(new Error('Could not clear journey photos'));
        });
        if (removalError) throw new Error('Could not clear journey history');
      });
      queue = work;
      return work;
    },
  };
}

function excerpt(text: string) {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean.length > 90 ? `${clean.slice(0, 87).trimEnd()}…` : clean;
}
function listJoin(items: string[]) {
  return items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** Qualitative, history-based observations. Returns null until at least two journeys exist. */
export function getBecomingThemes(entries: JourneyEntryData[]): string[] | null {
  if (entries.length < 2) return null;
  const ordered = [...entries].sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt));
  const counts = new Map<string, number>();
  ordered.forEach(entry => entry.selected.forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1)));
  const returning = values.map(value => value.name).filter(name => (counts.get(name) ?? 0) >= 2);
  const lines: string[] = [];
  lines.push(returning.length
    ? `${listJoin(returning)} keep${returning.length === 1 ? 's' : ''} returning to your path. That may be something worth trusting.`
    : 'Each journey has gathered different values. You are exploring many sides of what matters to you.');
  const actions = [...new Set(ordered.map(entry => entry.action))].slice(-3);
  lines.push(actions.length > 1
    ? `You have made room for steps like ${listJoin(actions.map(action => `“${excerpt(action)}”`))}.`
    : `You have returned to “${excerpt(actions[0] ?? '')}” more than once. Repeating a small step is its own kind of care.`);
  const reflections = ordered.filter(entry => entry.reflection.trim());
  const first = reflections[0];
  const last = reflections[reflections.length - 1];
  if (first && last && first !== last) lines.push(`Earlier you noticed: “${excerpt(first.reflection)}” More recently: “${excerpt(last.reflection)}” Notice what has shifted, or stayed true.`);
  else if (first) lines.push(`You once noticed: “${excerpt(first.reflection)}” Those words are still yours to return to.`);
  return lines;
}
