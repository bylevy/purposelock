import 'fake-indexeddb/auto';
import { Blob as NodeBlob } from 'node:buffer';
import { beforeEach, describe, expect, it } from 'vitest';
import { createJourneyStore, loadJourney, getBecomingThemes, parseIntention, JOURNEY_KEY, JOURNEY_PHOTO_DB, type JourneyEntry } from '@/lib/purpose-journey';
import { getThought } from '@/lib/purpose-values';

const entry = (id: string, selected: string[], action: string, reflection = '', photos: JourneyEntry['photos'] = []): JourneyEntry => ({ id, completedAt: new Date(2026, 0, Number(id.replace(/\D/g, '')) || 1).toISOString(), selected, action, thought: getThought(selected), reflection, photos });

beforeEach(async () => { Object.defineProperty(globalThis, 'Blob', { value: NodeBlob, configurable: true }); localStorage.clear(); await createJourneyStore().clear(); });

describe('My Journey archive', () => {
  it('stays empty and creates nothing on the device until saving is used (consent off)', async () => {
    expect(await loadJourney()).toEqual({ entries: [], intention: null });
    expect(localStorage.getItem(JOURNEY_KEY)).toBeNull();
    expect((await indexedDB.databases()).some(db => db.name === JOURNEY_PHOTO_DB)).toBe(false);
  });
  it('persists separate entries with exact quote, reflection and photo blobs', async () => {
    const blob = new Blob(['bytes'], { type: 'image/png' });
    const a = entry('e1', ['Courage'], 'Call a friend', 'It felt true', [{ blob, name: 'a.png' }]);
    const b = entry('e2', ['Growth'], 'Read a page');
    await createJourneyStore().save({ entries: [a, b], intention: null });
    expect(localStorage.getItem(JOURNEY_KEY)).not.toContain('bytes');
    const loaded = await loadJourney();
    expect(loaded.entries).toHaveLength(2);
    expect(loaded.entries[0]?.thought).toEqual(getThought(['Courage']));
    expect(loaded.entries[0]?.reflection).toBe('It felt true');
    expect(loaded.entries[0]?.photos[0]?.blob.size).toBe(blob.size);
    expect(loaded.entries[1]?.photos).toEqual([]);
  });
  it('deletes one entry and its photos while keeping the rest', async () => {
    const store = createJourneyStore();
    const a = entry('e1', ['Courage'], 'Walk', '', [{ blob: new Blob(['x'], { type: 'image/png' }), name: 'x.png' }]);
    const b = entry('e2', ['Health'], 'Stretch');
    await store.save({ entries: [a, b], intention: null });
    await store.save({ entries: [b], intention: null });
    const loaded = await loadJourney();
    expect(loaded.entries.map(item => item.id)).toEqual(['e2']);
  });
  it('saves, edits and clears an intention', async () => {
    const store = createJourneyStore();
    const intention = parseIntention({ text: 'Be patient', value: 'Compassion', period: 'week', setAt: new Date().toISOString() });
    await store.save({ entries: [], intention });
    expect((await loadJourney()).intention?.text).toBe('Be patient');
    await store.save({ entries: [], intention: { ...intention, text: 'Listen well', period: 'today' } });
    expect((await loadJourney()).intention?.period).toBe('today');
    await store.save({ entries: [], intention: null });
    expect((await loadJourney()).intention).toBeNull();
    expect(() => parseIntention({ ...intention, text: '  ' })).toThrow();
  });
  it('clear removes all history but invalidates queued saves', async () => {
    const store = createJourneyStore();
    const save = store.save({ entries: [entry('e1', ['Family'], 'Cook')], intention: null });
    await store.clear();
    expect(await save).toBe(false);
    expect(localStorage.getItem(JOURNEY_KEY)).toBeNull();
  });
});

describe('Who am I becoming?', () => {
  it('does not invent patterns with fewer than two journeys', () => {
    expect(getBecomingThemes([])).toBeNull();
    expect(getBecomingThemes([entry('e1', ['Courage'], 'Walk')])).toBeNull();
  });
  it('names values that return and how reflections changed, without numbers', () => {
    const lines = getBecomingThemes([entry('e1', ['Courage', 'Growth'], 'Walk', 'It felt hard'), entry('e2', ['Courage'], 'Call mom', 'It felt true')]) ?? [];
    expect(lines.join(' ')).toContain('Courage keeps returning');
    expect(lines.join(' ')).toContain('It felt hard');
    expect(lines.join(' ')).toContain('It felt true');
    expect(lines.join(' ')).not.toMatch(/\d|streak|score|%/i);
  });
});
