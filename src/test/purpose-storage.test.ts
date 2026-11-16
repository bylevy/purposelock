import 'fake-indexeddb/auto';
import { Blob as NodeBlob } from 'node:buffer';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDeviceStore, loadProgress, parseProgress, PROGRESS_KEY, PHOTO_DB, type ProgressSnapshot } from '@/lib/purpose-storage';
import { getThought } from '@/lib/purpose-values';

const snapshot: ProgressSnapshot = { version: 1, consent: true, stage: 'ending', selected: ['Courage'], memory: 'A private memory', showMemory: true, action: '', customAction: 'Take a walk', useCustom: true, minutes: 10, remaining: 597, showAllActions: false, reflection: 'I tried', thought: getThought(['Courage']), revealed: true, turned: true };

beforeEach(async () => { Object.defineProperty(globalThis, 'Blob', { value: NodeBlob, configurable: true }); localStorage.clear(); await createDeviceStore().clear(); });
describe('consented local progress', () => {
  it('does not create local saved state or a photo database when consent is off', async () => {
    expect(await loadProgress()).toBeNull();
    expect(localStorage.length).toBe(0);
    expect((await indexedDB.databases()).some(db => db.name === PHOTO_DB)).toBe(false);
  });
  it('restores consented personal content, exact thought, duration, remaining time, and postcard side', async () => {
    await createDeviceStore().save(snapshot, []);
    expect((await loadProgress())?.snapshot).toEqual(snapshot);
  });
  it('stores photo blobs only in IndexedDB and removes deleted photos from the saved collection', async () => {
    const store = createDeviceStore();
    const blob = new Blob(['photo bytes'], { type: 'image/png' });
    await store.save(snapshot, [{ name: 'reminder.png', blob }]);
    expect(localStorage.getItem(PROGRESS_KEY)).not.toContain('photo bytes');
    expect(localStorage.getItem(PROGRESS_KEY)).not.toContain('reminder.png');
    expect((await loadProgress())?.photos[0]?.blob.size).toBe(blob.size);
    await store.save(snapshot, []);
    expect((await loadProgress())?.photos).toEqual([]);
  });
  it('clear deletes all app state and blobs without deleting unrelated browser data', async () => {
    const store = createDeviceStore();
    localStorage.setItem('unrelated', 'keep');
    await store.save(snapshot, [{ name: 'x.png', blob: new Blob(['x'], { type: 'image/png' }) }]);
    await store.clear();
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
    expect((await indexedDB.databases()).some(db => db.name === PHOTO_DB)).toBe(false);
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });
  it('clear invalidates queued saves so a reset cannot resurrect content', async () => {
    const store = createDeviceStore();
    const save = store.save(snapshot, []);
    await store.clear();
    expect(await save).toBe(false);
    expect(await loadProgress()).toBeNull();
  });
  it('rejects unconsented or invalid saved progress rather than resuming it', () => {
    expect(() => parseProgress(JSON.stringify({ ...snapshot, consent: false }))).toThrow();
    expect(() => parseProgress(JSON.stringify({ ...snapshot, minutes: 121 }))).toThrow();
    expect(() => parseProgress(JSON.stringify({ ...snapshot, remaining: 601 }))).toThrow();
    expect(() => parseProgress(JSON.stringify({ ...snapshot, selected: [] }))).toThrow();
  });
});