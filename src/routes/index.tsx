import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Sprout, Sparkles, Check, Leaf, Heart, Quote, ImagePlus, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PurposeLandscape } from '@/components/purpose-landscape';
import { CalmPath } from '@/components/calm-path';
import { values, getAffirmation, getThought } from '@/lib/purpose-values';
import { FocusTimer } from '@/components/purpose-timer';
import { PhotoPicker, useSessionPhotos } from '@/components/purpose-photos';
import { DevicePrivacy } from '@/components/device-privacy';
import { createDeviceStore, loadProgress, type Stage, type ProgressSnapshot } from '@/lib/purpose-storage';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { PurposeEnding } from '@/components/purpose-ending';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'PurposeLock · A small step toward what matters' },
    { name: 'description', content: 'A gentle values-led journey. Choose what matters, carry a personal reminder, and take one small action. Your content stays local, with optional saving on your own browser/device.' },
    { property: 'og:title', content: 'PurposeLock · A small step toward what matters' },
    { property: 'og:description', content: 'Follow a calm path from personal values to one meaningful action and your own Values Postcard.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: PurposeLock,
});

const stopForStage: Record<Stage, number> = { welcome: 0, values: 1, reminders: 2, thought: 3, action: 4, focus: 4, reflection: 4, ending: 5 };

function PurposeLock() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [selected, setSelected] = useState<string[]>([]);
  const [memory, setMemory] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [action, setAction] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [error, setError] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [showAllActions, setShowAllActions] = useState(false);
  const [reflection, setReflection] = useState('');
  const [thought, setThought] = useState<ReturnType<typeof getThought> | null>(null);
  const [revealed, setRevealed] = useState(false);
  const photoSession = useSessionPhotos();
  const [remaining, setRemaining] = useState(300);
  const [turned, setTurned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Opening your private visit…');
  const [confirmBegin, setConfirmBegin] = useState(false);
  const [deviceStore] = useState(createDeviceStore);
  const savingRef = useRef(false);
  const revision = useRef(0);
  const privacyNote = saving ? 'Saved only in this browser on this device. Never uploaded.' : 'Only in memory for this visit. Nothing you enter is saved or uploaded.';

  useEffect(() => {
    let active = true;
    loadProgress().then(saved => {
      if (!active) return;
      if (saved) {
        const data = saved.snapshot;
        setStage(data.stage); setSelected(data.selected); setMemory(data.memory); setShowMemory(data.showMemory);
        setAction(data.action); setCustomAction(data.customAction); setUseCustom(data.useCustom); setMinutes(data.minutes);
        setRemaining(data.remaining); setShowAllActions(data.showAllActions); setReflection(data.reflection);
        setThought(data.thought); setRevealed(data.revealed); setTurned(data.turned);
        photoSession.restorePhotos(saved.photos); savingRef.current = true; setSaving(true);
        setStatus('Saved on this device');
      } else setStatus('Not saved · this visit only');
    }).catch(() => { if (active) setStatus('Saved progress could not be opened. Saving is off; clear it or retry later.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [deviceStore]);

  useEffect(() => {
    if (!ready || !saving || !savingRef.current) return;
    const currentRevision = ++revision.current;
    setStatus('Saving on this device…');
    const snapshot: ProgressSnapshot = { version: 1, consent: true, stage, selected, memory, showMemory, action, customAction, useCustom, minutes, remaining, showAllActions, reflection, thought, revealed, turned };
    deviceStore.save(snapshot, photoSession.photos).then(saved => {
      if (saved && savingRef.current && currentRevision === revision.current) setStatus('Saved on this device');
    }).catch(() => { if (savingRef.current && currentRevision === revision.current) setStatus('Changes not saved. Device storage may be full or unavailable. Clear saved progress or free space and try again.'); });
  }, [ready, saving, stage, selected, memory, showMemory, action, customAction, useCustom, minutes, remaining, showAllActions, reflection, thought, revealed, turned, photoSession.photos, deviceStore]);

  async function deleteSaved(reset: boolean) {
    savingRef.current = false; revision.current++; setSaving(false); setBusy(true);
    if (reset) resetFlow();
    try { await deviceStore.clear(); setStatus('Not saved · this visit only'); }
    catch { setStatus('Could not delete every saved item. Close other PurposeLock tabs and retry Clear my saved progress.'); }
    finally { setBusy(false); }
  }

  const mainRef = useRef<HTMLElement>(null);
  const finalAction = useCustom ? customAction.trim() : action;
  const suggestions = values.filter(value => selected.includes(value.name));
  const visibleSuggestions = showAllActions ? suggestions : suggestions.slice(0, 3);

  useEffect(() => {
    if (stage !== 'welcome') mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [stage]);

  function goTo(next: Stage) { setError(''); if (next === 'action') setRemaining(minutes * 60); setStage(next); }
  function toggleValue(name: string) {
    setError('');
    setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  }
  function resetFlow() {
    photoSession.clearPhotos(); setStage('welcome'); setSelected([]); setMemory(''); setShowMemory(false);
    setAction(''); setCustomAction(''); setUseCustom(false); setError(''); setMinutes(5);
    setShowAllActions(false); setReflection(''); setThought(null); setRevealed(false); setRemaining(300); setTurned(false);
  }
  function carryValues() {
    if (!selected.length) { setError('Choose one value that feels like you.'); return; }
    const nextThought = getThought(selected);
    if (thought?.text !== nextThought.text) setRevealed(false);
    setThought(nextThought); setShowAllActions(false);
    if (!useCustom && !values.some(value => selected.includes(value.name) && value.action === action)) setAction('');
    goTo('reminders');
  }

  return <div className={`purpose-shell ${stage !== 'welcome' ? 'journey-shell' : ''}`}>
    <header className="site-header"><div className="wordmark"><Sprout className="brand-leaf" aria-hidden="true" />PurposeLock</div><div className="header-note"><Sparkles aria-hidden="true" /><span>A little closer to yourself.</span></div></header>
    {ready ? <DevicePrivacy saving={saving} status={status} busy={busy} onEnable={() => { savingRef.current = true; setSaving(true); }} onDisable={() => deleteSaved(false)} onClear={() => deleteSaved(true)} /> : <p className="privacy-note" role="status">Opening your private visit…</p>}
    {!ready ? null : stage === 'welcome' ? <main className="welcome">
      <div className="eyebrow"><Sprout />Small steps. Deeper roots.</div>
      <h1>You don’t have to feel<br /><em>ready</em> to begin.</h1>
      <p className="welcome-copy">Find what matters. Make room for one small step.</p>
      <div className="welcome-cta"><Button variant="reset" onClick={() => goTo('values')}>Start my reset<ArrowRight /></Button></div>
      <div className="invitation"><Leaf /><span>No pressure. Just a beginning.</span></div>
      <PurposeLandscape />
      <div className="welcome-waypoints" aria-label="Your journey"><span><Leaf />Find your values</span><span><Heart />Try a small step</span><span><ImagePlus />Keep what matters</span></div>
    </main> : <>
      <main ref={mainRef} tabIndex={-1} className={`experience journey-experience outline-none ${stage === 'focus' ? 'focus-experience' : ''} ${stage === 'ending' ? 'destination-experience' : ''}`}>
        <CalmPath active={stopForStage[stage]} />
        <div className="journey-stop" key={stage}>
        {stage === 'values' && <>
          <div className="step-heading"><div className="eyebrow"><Leaf />Find your north</div><h1>What matters to you?</h1><p>Choose every value that feels like you.</p></div>
          <div className="value-count"><span>Your core values</span><span aria-live="polite">{selected.length} selected</span></div>
          <div className="values-grid" role="group" aria-label="Choose your core values">{values.map(value => {
            const chosen = selected.includes(value.name);
            return <Button key={value.name} variant="value" className={`path-value ${chosen ? 'selected' : ''}`} aria-pressed={chosen} onClick={() => toggleValue(value.name)}><span className="value-title"><value.icon />{value.name}</span><span className={`value-description ${chosen ? 'description-revealed' : ''}`}>{value.description}</span>{chosen && <Check className="selected-check" aria-hidden="true" />}</Button>;
          })}</div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="step-actions"><Button variant="ghost" onClick={() => goTo('welcome')}><ArrowLeft />Back</Button><Button variant="reset" onClick={carryValues}>Carry these with me<ArrowRight /></Button></div>
        </>}
        {stage === 'reminders' && <>
          <div className="step-heading"><div className="eyebrow"><ImagePlus />A personal anchor</div><h1>Bring what matters closer.</h1><p>A person, a place, a moment. Always optional.</p></div>
          <PhotoPicker {...photoSession} saving={saving} />
          <div className="memory-toggle"><Button variant="ghost" aria-expanded={showMemory} onClick={() => setShowMemory(current => !current)}><PenLine />{showMemory ? 'Hide memory' : 'Add a memory instead—or too'}</Button></div>
          {showMemory && <div className="field-group"><label className="field-label" htmlFor="memory">When have you lived one of these values? <span>(optional)</span></label><textarea id="memory" className="purpose-textarea" value={memory} onChange={event => setMemory(event.target.value)} placeholder="One moment I remember…" maxLength={3000} /></div>}
          <div className="step-actions"><Button variant="ghost" onClick={() => goTo('values')}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => goTo('thought')}>{photoSession.photos.length || memory.trim() ? 'Bring these along' : 'Skip for now'}<ArrowRight /></Button></div>
        </>}
        {stage === 'thought' && thought && <>
          <div className="step-heading"><div className="eyebrow"><Heart />Already within you</div><h1>You’re not starting from nothing.</h1></div>
          <div className="value-tags">{selected.map(value => <span className="value-tag" key={value}>{value}</span>)}</div>
          <div className={`thought-reveal ${revealed ? 'revealed' : ''}`}>
            {!revealed ? <><Quote className="reveal-mark" aria-hidden="true" /><p>A thought rooted in your values.</p><Button variant="reset" onClick={() => setRevealed(true)}>Reveal my thought<Sparkles /></Button></> : <div className="revealed-thought" aria-live="polite"><blockquote>“{thought.text}”</blockquote><p className="postcard-attribution">— {thought.attribution}</p><p className="brief-affirmation">{getAffirmation(selected)}</p>{memory.trim() && <details className="memory-recall"><summary>Your reminder</summary><p>{memory.trim()}</p></details>}</div>}
          </div>
          <p className="worth-note">Your worth is not measured by productivity.</p>
          <div className="step-actions"><Button variant="ghost" onClick={() => goTo('reminders')}><ArrowLeft />Back</Button>{revealed && <Button variant="reset" onClick={() => goTo('action')}>Take one small step<ArrowRight /></Button>}</div>
        </>}
        {stage === 'action' && <>
          <div className="step-heading"><div className="eyebrow"><Sprout />A little movement</div><h1>What feels doable?</h1><p>One small action. Not another to-do list.</p></div>
          <div className="action-options" role="group" aria-label="Choose your small action">{visibleSuggestions.map(value => <Button key={value.name} variant="action" className={!useCustom && action === value.action ? 'selected' : ''} aria-pressed={!useCustom && action === value.action} onClick={() => { setAction(value.action); setUseCustom(false); setError(''); }}><span className="radio-dot" aria-hidden="true" /><span><span className="action-value-label">{value.name}</span>{value.action}</span></Button>)}
            {suggestions.length > 3 && <Button variant="ghost" aria-expanded={showAllActions} onClick={() => setShowAllActions(current => !current)}>{showAllActions ? 'Fewer ideas' : 'More ideas'}</Button>}
            <Button variant="action" className={useCustom ? 'selected' : ''} aria-pressed={useCustom} onClick={() => { setUseCustom(true); setError(''); }}><PenLine />Write my own small step</Button>
          </div>
          {useCustom && <div className="field-group"><label htmlFor="custom-action" className="field-label">What’s your small step?</label><textarea autoFocus id="custom-action" className="purpose-textarea" value={customAction} onChange={event => setCustomAction(event.target.value)} placeholder="One little thing I can try…" maxLength={500} /></div>}
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="step-actions"><Button variant="ghost" onClick={() => goTo('thought')}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => { if (!finalAction) { setError('Choose a step, or write your own.'); return; } goTo('focus'); }}>Make a little space<ArrowRight /></Button></div>
        </>}
        {stage === 'focus' && <>
          <div className="step-heading"><div className="eyebrow"><Leaf />Your time to try</div><h1>No rush. Just a beginning.</h1></div>
          {photoSession.photos[0] && <img className="focus-reminder" src={photoSession.photos[0].url} alt={`Your personal reminder: ${photoSession.photos[0].name}`} />}
          <h2 className="focus-action">{finalAction}</h2>
          <FocusTimer minutes={minutes} initialSeconds={remaining} onRemainingChange={setRemaining} onDurationChange={duration => { setMinutes(duration); setRemaining(duration * 60); }} />
          <Button variant="reset" onClick={() => goTo('reflection')}>I gave it a try<ArrowRight /></Button>
          <div className="mt-5"><Button variant="ghost" onClick={() => goTo('action')}><ArrowLeft />Choose a different step</Button></div>
        </>}
        {stage === 'reflection' && <>
          <div className="step-heading"><div className="eyebrow"><Sprout />Notice, gently</div><h1>What did you notice?</h1><p>No score. No right answer.</p></div>
          <div className="reflection-context"><span>Your small step</span><p>{finalAction}</p></div>
          <div className="reflection-prompts" aria-label="Optional reflection starters">{['It felt true', 'It felt hard', 'I’m still exploring'].map(prompt => <Button key={prompt} variant="outline" onClick={() => setReflection(current => current.trim() ? current : `${prompt} because `)}>{prompt}</Button>)}</div>
          <div className="field-group"><label className="field-label" htmlFor="reflection">How did this connect with your values? <span>(optional)</span></label><textarea id="reflection" className="purpose-textarea" value={reflection} onChange={event => setReflection(event.target.value)} placeholder="A few words, if you want…" rows={4} maxLength={5000} /></div>
          <div className="step-actions"><Button variant="ghost" onClick={() => goTo('focus')}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => goTo('ending')}>{reflection.trim() ? 'Save my reflection' : 'See my postcard'}<ArrowRight /></Button></div>
          {reflection.trim() && <div className="text-center mt-4"><Button variant="ghost" onClick={() => { setReflection(''); goTo('ending'); }}>Finish without writing</Button></div>}
          <p className="privacy-note">{privacyNote}</p>
        </>}
        {stage === 'ending' && thought && <PurposeEnding photos={photoSession.photos} thought={thought} selected={selected} action={finalAction} reflection={reflection} turned={turned} onTurn={setTurned} saving={saving} onBeginAgain={() => setConfirmBegin(true)} />}
        </div>
      </main>
      <div className="journey-landscape" aria-hidden="true"><PurposeLandscape /></div>
    </>}
    <AlertDialog open={confirmBegin} onOpenChange={setConfirmBegin}><AlertDialogContent className="privacy-dialog"><AlertDialogTitle>Begin a fresh reset?</AlertDialogTitle><AlertDialogDescription>This clears your postcard, words, and photos, including any saved copy on this device. Your current postcard cannot be recovered.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline" disabled={busy}>Keep my postcard</Button></AlertDialogCancel><Button variant="reset" disabled={busy} onClick={async () => { await deleteSaved(true); setConfirmBegin(false); }}>Clear & begin again</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <footer className="site-footer"><Sprout aria-hidden="true" /><span>PurposeLock · A prototype for values-led action</span></footer>
  </div>;
}
