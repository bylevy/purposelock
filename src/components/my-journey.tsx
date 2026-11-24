import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Compass, Leaf, Sprout, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValuesPostcard } from '@/components/purpose-ending';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { values } from '@/lib/purpose-values';
import { getBecomingThemes, type Intention, type JourneyEntry } from '@/lib/purpose-journey';

export function formatJourneyDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function ArchivedPostcard({ entry, onClose }: { entry: JourneyEntry; onClose: () => void }) {
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [turned, setTurned] = useState(false);
  useEffect(() => {
    const urls = entry.photos.map(photo => ({ url: URL.createObjectURL(photo.blob), name: photo.name }));
    setPhotos(urls);
    return () => urls.forEach(photo => URL.revokeObjectURL(photo.url));
  }, [entry]);
  return <section className="journey-entry-view" aria-labelledby="archived-heading">
    <div className="step-heading"><div className="eyebrow"><Leaf />{formatJourneyDate(entry.completedAt)}</div><h2 id="archived-heading" className="journey-title">A postcard from your path</h2></div>
    <ValuesPostcard id="archived-postcard" photos={photos} thought={entry.thought} selected={entry.selected} action={entry.action} reflection={entry.reflection} turned={turned} onTurn={setTurned} />
    <div className="step-actions"><Button variant="ghost" onClick={onClose}><ArrowLeft />Back to My Journey</Button></div>
  </section>;
}

function IntentionCard({ intention, suggested, onSave, onClear }: { intention: Intention | null; suggested: string[]; onSave: (intention: Intention) => void; onClear: () => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [period, setPeriod] = useState<Intention['period']>('today');
  const [error, setError] = useState('');
  function startEdit() {
    setText(intention?.text ?? ''); setValue(intention?.value ?? suggested[0] ?? values[0]?.name ?? 'Growth');
    setPeriod(intention?.period ?? 'today'); setError(''); setEditing(true);
  }
  const ordered = [...suggested, ...values.map(item => item.name).filter(name => !suggested.includes(name))];
  return <section className="journey-card" aria-labelledby="intention-heading">
    <h2 id="intention-heading" className="journey-card-title"><Compass aria-hidden="true" />An intention to carry</h2>
    {!editing ? intention ? <div className="intention-current">
      <span className="value-tag">{intention.value} · {intention.period === 'today' ? 'Today' : 'This week'}</span>
      <p className="intention-text">{intention.text}</p>
      <div className="journey-inline-actions"><Button variant="outline" size="sm" onClick={startEdit}>Edit intention</Button><Button variant="ghost" size="sm" onClick={onClear}>Clear intention</Button></div>
    </div> : <div><p className="journey-muted">Optional. One gentle direction for today or this week—not a task.</p><Button variant="outline" size="sm" onClick={startEdit}>Set an intention</Button></div>
    : <form className="intention-form" onSubmit={event => {
      event.preventDefault();
      if (!text.trim()) { setError('Write a few words, or cancel.'); return; }
      onSave({ text: text.trim(), value, period, setAt: new Date().toISOString() }); setEditing(false);
    }}>
      <fieldset className="intention-period"><legend className="field-label">For</legend>
        {(['today', 'week'] as const).map(option => <Button key={option} type="button" variant="outline" size="sm" className={period === option ? 'selected' : ''} aria-pressed={period === option} onClick={() => setPeriod(option)}>{option === 'today' ? 'Today' : 'This week'}</Button>)}
      </fieldset>
      <label className="field-label" htmlFor="intention-value">Rooted in</label>
      <select id="intention-value" className="intention-select" value={value} onChange={event => setValue(event.target.value)}>{ordered.map(name => <option key={name} value={name}>{name}</option>)}</select>
      <label className="field-label" htmlFor="intention-text">My intention</label>
      <input id="intention-text" className="intention-input" value={text} maxLength={200} onChange={event => { setText(event.target.value); setError(''); }} placeholder="I want to meet today with…" />
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="journey-inline-actions"><Button type="submit" variant="reset" size="sm">Keep this intention</Button><Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button></div>
    </form>}
  </section>;
}

export function MyJourney({ entries, intention, saving, currentValues, onSetIntention, onDeleteEntry, onClearHistory, onClose }: {
  entries: JourneyEntry[]; intention: Intention | null; saving: boolean; currentValues: string[];
  onSetIntention: (intention: Intention | null) => void; onDeleteEntry: (id: string) => void; onClearHistory: () => Promise<void>; onClose: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'one'; id: string } | { kind: 'all' } | null>(null);
  const sorted = [...entries].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));
  const open = sorted.find(entry => entry.id === openId);
  const themes = getBecomingThemes(entries);
  const suggested = currentValues.length ? currentValues : sorted[0]?.selected ?? [];
  if (open) return <main className="experience journey-experience my-journey"><ArchivedPostcard entry={open} onClose={() => setOpenId(null)} /></main>;
  return <main className="experience journey-experience my-journey" aria-labelledby="my-journey-heading">
    <div className="step-heading"><div className="eyebrow"><BookOpen />Your keepsakes</div><h1 id="my-journey-heading">My Journey</h1><p>Postcards from the paths you have walked.</p></div>
    <p className="privacy-note journey-privacy">{saving ? 'Kept only in this browser on this device. Never uploaded.' : 'Device saving is off: your journey history and intention last only while this page stays open. Turn on saving above to keep them on this device.'}</p>
    <IntentionCard intention={intention} suggested={suggested} onSave={onSetIntention} onClear={() => onSetIntention(null)} />
    <section className="journey-card" aria-labelledby="becoming-heading">
      <h2 id="becoming-heading" className="journey-card-title"><Sprout aria-hidden="true" />Who am I becoming?</h2>
      {themes ? <ul className="becoming-list">{themes.map(line => <li key={line}>{line}</li>)}</ul>
        : <p className="journey-muted">{entries.length ? 'One postcard is a beautiful beginning. After another journey, gentle themes from your own words will appear here.' : 'Your path is just beginning. Complete a journey and your postcards will gather here.'}</p>}
    </section>
    <section aria-labelledby="archive-heading" className="journey-archive">
      <h2 id="archive-heading" className="journey-card-title"><Leaf aria-hidden="true" />Saved postcards</h2>
      {sorted.length ? <ul className="archive-list">{sorted.map(entry => <li key={entry.id} className="archive-item">
        <div className="archive-meta"><span className="archive-date">{formatJourneyDate(entry.completedAt)}</span><span className="archive-values">{entry.selected.join(' · ')}</span><p>{entry.action}</p></div>
        <div className="journey-inline-actions"><Button variant="outline" size="sm" onClick={() => setOpenId(entry.id)} aria-label={`Open postcard from ${formatJourneyDate(entry.completedAt)}`}>Open postcard</Button><Button variant="ghost" size="sm" onClick={() => setConfirm({ kind: 'one', id: entry.id })} aria-label={`Delete postcard from ${formatJourneyDate(entry.completedAt)}`}><Trash2 />Delete</Button></div>
      </li>)}</ul> : <p className="journey-muted">No postcards yet. Your first one will arrive at the end of the path.</p>}
      {sorted.length > 1 && <div className="text-center mt-4"><Button variant="ghost" size="sm" onClick={() => setConfirm({ kind: 'all' })}><Trash2 />Clear all journey history</Button></div>}
    </section>
    <div className="step-actions"><Button variant="reset" onClick={onClose}><ArrowLeft />Back to my path</Button></div>
    <AlertDialog open={confirm !== null} onOpenChange={value => { if (!value) setConfirm(null); }}>
      <AlertDialogContent className="privacy-dialog"><AlertDialogTitle>{confirm?.kind === 'all' ? 'Clear all journey history?' : 'Delete this postcard?'}</AlertDialogTitle><AlertDialogDescription>{confirm?.kind === 'all' ? 'This removes every saved postcard and its photos from My Journey. Your intention and current path stay. This cannot be undone.' : 'This removes the postcard and its photos from My Journey. This cannot be undone.'}</AlertDialogDescription>
        <AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline">Keep it</Button></AlertDialogCancel><Button variant="reset" onClick={async () => { if (confirm?.kind === 'one') onDeleteEntry(confirm.id); else if (confirm) await onClearHistory(); setConfirm(null); }}>{confirm?.kind === 'all' ? 'Clear history' : 'Delete postcard'}</Button></AlertDialogFooter></AlertDialogContent>
    </AlertDialog>
  </main>;
}
