import { z } from 'zod';
import { values } from '@/lib/purpose-values';

export const PROGRESS_KEY = 'purposelock.progress.v1';
export const PHOTO_DB = 'purposelock.photos.v1';
export const stages = ['welcome', 'values', 'reminders', 'thought', 'action', 'focus', 'reflection', 'ending'] as const;
export type Stage = typeof stages[number];
const snapshotSchema = z.object({
  version: z.literal(1), consent: z.literal(true),
  stage: z.enum(stages), selected: z.array(z.string()).max(9).refine(items => new Set(items).size === items.length && items.every(item => values.some(value => value.name === item))),
  memory: z.string().max(3000), showMemory: z.boolean(), action: z.string().max(500),
  customAction: z.string().max(500), useCustom: z.boolean(), minutes: z.number().int().min(1).max(120),
  remaining: z.number().int().min(0).max(7200), showAllActions: z.boolean(),
  reflection: z.string().max(5000), thought: z.object({ values: z.array(z.string()).max(9), text: z.string().min(1).max(2000), attribution: z.string().superRefine((value, context) => { if (value !== 'An original PurposeLock reflection') context.addIssue({ code: 'custom', message: 'Invalid attribution' }); }) }).nullable(),
  revealed: z.boolean(), turned: z.boolean(),
}).refine(data => data.remaining <= data.minutes * 60)
  .refine(data => ['welcome', 'values'].includes(data.stage) || (data.selected.length > 0 && data.thought !== null))
  .refine(data => !['focus', 'reflection', 'ending'].includes(data.stage) || Boolean(data.useCustom ? data.customAction.trim() : data.action.trim()));
export type ProgressSnapshot = z.infer<typeof snapshotSchema>;
export type StoredPhoto = { blob: Blob; name: string };

export function parseProgress(raw: string): ProgressSnapshot {
  return snapshotSchema.parse(JSON.parse(raw));
}

function openPhotos(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('photos');
    request.onerror = () => reject(new Error('Photo storage unavailable'));
    request.onblocked = () => reject(new Error('Photo storage busy'));
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
}
async function photoTransaction(mode: IDBTransactionMode, photos?: StoredPhoto[]): Promise<StoredPhoto[]> {
  const db = await openPhotos();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction('photos', mode);
      const store = transaction.objectStore('photos');
      const request = mode === 'readonly' ? store.get('current') : store.put(photos ?? [], 'current');
      let result: StoredPhoto[] = [];
      request.onsuccess = () => {
        if (mode === 'readonly') {
          const rows: unknown = request.result;
          if (rows === undefined) return;
          if (!Array.isArray(rows) || !rows.every(row => row && row.blob instanceof Blob && row.blob.type.startsWith('image/') && row.blob.size <= 15 * 1024 * 1024 && typeof row.name === 'string')) {
            transaction.abort(); return;
          }
          result = rows;
        }
      };
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = transaction.onabort = () => reject(new Error('Photo storage unavailable'));
    });
  } finally { db.close(); }
}
export async function loadProgress(): Promise<{ snapshot: ProgressSnapshot; photos: StoredPhoto[] } | null> {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return null; // No IndexedDB access before consent.
  const snapshot = parseProgress(raw);
  const photos = await photoTransaction('readonly');
  return { snapshot, photos };
}

// One controller per mounted flow. Clearing invalidates queued writes immediately.
export function createDeviceStore() {
  let queue: Promise<unknown> = Promise.resolve();
  let generation = 0;
  let lastPhotos: StoredPhoto[] | null = null;
  return {
    save(snapshot: ProgressSnapshot, photos: StoredPhoto[]): Promise<boolean> {
      const token = generation;
      const work = queue.catch(() => {}).then(async () => {
        if (token !== generation) return false;
        snapshotSchema.parse(snapshot);
        if (lastPhotos !== photos) {
          await photoTransaction('readwrite', photos);
          lastPhotos = photos;
        }
        if (token !== generation) return false;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot));
        return true;
      });
      queue = work;
      return work;
    },
    clear(): Promise<void> {
      generation++;
      // Remove consent synchronously even if an older photo write is still finishing.
      let removalError = false;
      try { localStorage.removeItem(PROGRESS_KEY); } catch { removalError = true; }
      const work = queue.catch(() => {}).then(async () => {
        lastPhotos = null;
        await new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase(PHOTO_DB);
          request.onsuccess = () => resolve();
          request.onerror = request.onblocked = () => reject(new Error('Could not clear photo storage'));
        });
        if (removalError) throw new Error('Could not clear progress storage');
      });
      queue = work;
      return work;
    },
  };
}