import { describe, it, expect } from 'vitest';
import { getThought, values, getCompletionAnalysis, getNextSteps } from '@/lib/purpose-values';
const names = values.map(v => v.name);
const combos = [...names.map(n => [n]), ['Growth','Courage'], ['Compassion','Connection'], ['Family','Connection'], ['Integrity','Independence'], ['Growth','Family'], ['Health','Curiosity','Courage'], ['Growth','Compassion','Family','Health'], ['Courage','Curiosity','Integrity','Independence','Connection'], names];
describe('thoughts', () => {
  it('are non-empty, unique per selection, original-attributed, and not repeated in ending text', () => {
    const texts = combos.map(c => getThought(c));
    texts.forEach((t, i) => {
      expect(t.text.length).toBeGreaterThan(20);
      expect(t.attribution).toBe('An original PurposeLock reflection');
      const ending = getCompletionAnalysis(combos[i]!, values[0]!.action, 'x') + getNextSteps(combos[i]!, values[0]!.action).join(' ');
      expect(ending).not.toContain(t.text);
    });
    expect(new Set(texts.map(t => t.text)).size).toBe(combos.length);
  });
  it('is deterministic regardless of selection order', () => {
    expect(getThought(['Courage','Growth']).text).toBe(getThought(['Growth','Courage']).text);
  });
});
