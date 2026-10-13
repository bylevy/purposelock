import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Sprout, Heart, Compass, Sparkles, Clock3, Check, Quote, Leaf, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PurposeLandscape } from '@/components/purpose-landscape';
import { values, getAffirmation, getThought, getActionAnalysis } from '@/lib/purpose-values';
import { FocusTimer } from '@/components/purpose-timer';
import { PhotoPicker, PhotoBoard, useSessionPhotos } from '@/components/purpose-photos';
import { PurposeEnding } from '@/components/purpose-ending';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'PurposeLock · Your values. Your next small step.' },
    { name: 'description', content: 'You don’t have to feel ready to begin. Reconnect with your core values, find a personal affirmation, and take one gentle step toward who you want to be.' },
    { property: 'og:title', content: 'PurposeLock · Your values. Your next small step.' },
    { property: 'og:description', content: 'A gentle, private reset for self-affirmation and values-led action. Begin exactly where you are.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: PurposeLock,
});

function Progress({ step }: { step: number }) {
  return <nav className="progress" aria-label="Your reset progress">{['Your values', 'Your next step', 'Your focus'].map((label, index) => <div className="flex items-center gap-2" key={label}>
    {index > 0 && <span className="progress-line" aria-hidden="true" />}
    <div className={`progress-item ${step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''}`} aria-current={step === index + 1 ? 'step' : undefined}>
      <span className="progress-number">{step > index + 1 ? <Check size={12} /> : index + 1}</span><span>{label}</span>
    </div>
  </div>)}</nav>;
}

function PurposeLock() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [memory, setMemory] = useState('');
  const [action, setAction] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [error, setError] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [showAllActions, setShowAllActions] = useState(false);
  const photoSession = useSessionPhotos();
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const [thought, setThought] = useState<ReturnType<typeof getThought> | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const finalAction = useCustom ? customAction.trim() : action;
  const suggestions = values.filter(value => selected.includes(value.name));
  const visibleSuggestions = showAllActions ? suggestions : suggestions.slice(0, 3);

  useEffect(() => {
    if (step > 0) mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, saved]);

  function goTo(next: number) { setError(''); setStep(next); }
  function toggleValue(name: string) {
    setError('');
    setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  }
  function resetFlow() {
    photoSession.clearPhotos(); setMinutes(5); setShowAllActions(false); setStep(0); setSelected([]); setMemory(''); setAction(''); setCustomAction(''); setUseCustom(false);
    setError(''); setReflection(''); setSaved(false); setThought(null);
  }

  return <div className="purpose-shell">
    <header className="site-header">
      <div className="wordmark"><svg className="brand-leaf" viewBox="0 0 32 36" fill="none" aria-hidden="true"><path d="M16 31V17M16 23C4 23 2 12 4 7c9 0 14 6 12 16ZM16 17C16 7 22 3 29 4c0 9-5 14-13 13Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>PurposeLock</div>
      <div className="header-note"><Sparkles aria-hidden="true" /><span>A little closer to yourself.</span></div>
    </header>

    {step === 0 ? <main className="welcome">
      <div className="eyebrow"><Sprout />Rooted in you. Not your to-do list.</div>
      <h1>You don’t have to feel<br /><em>ready</em> to begin.</h1>
      <p className="welcome-copy">Pause the pressure. Reconnect with what matters to you.<br />Take one small step toward the person you want to be.</p>
      <div className="welcome-cta"><Button variant="reset" onClick={() => goTo(1)}>Start my reset<ArrowRight /></Button></div>
      <div className="invitation"><Clock3 /><span>A few quiet minutes. Just for you.</span></div>
      <PurposeLandscape />
      <section className="principles" aria-label="A gentler beginning">
        <div className="principle"><Compass /><div><h3>Find your north.</h3><p>Not what you should care about.<br />What you actually do.</p></div></div>
        <div className="principle"><Heart /><div><h3>Remember your worth.</h3><p>You’re more than what you get done.<br />You always have been.</p></div></div>
        <div className="principle"><Sprout /><div><h3>Begin with something small.</h3><p>No big reinvention. Just one action<br />that feels like you.</p></div></div>
      </section>
    </main> : <main ref={mainRef} tabIndex={-1} className={`experience outline-none ${step === 3 ? 'focus-experience' : ''}`}>
      {step <= 3 && <Progress step={step} />}
      {step === 1 && <>
        <div className="step-heading"><div className="eyebrow"><Compass />Find your north</div><h1>What feels like you?</h1><p>Choose every value you genuinely identify with.<br />There are no right answers. Just what matters to you.</p></div>
        <div className="value-count"><span>Your core values</span><span aria-live="polite">{selected.length} selected</span></div>
        <div className="values-grid" role="group" aria-label="Choose your core values">{values.map(value => <Button key={value.name} variant="value" className={selected.includes(value.name) ? 'selected' : ''} aria-pressed={selected.includes(value.name)} onClick={() => toggleValue(value.name)}>
          <span className="value-title"><value.icon />{value.name}</span><span className="value-description">{value.description}</span>{selected.includes(value.name) && <Check className="selected-check" />}
        </Button>)}</div>
        <div className="field-group"><label className="field-label" htmlFor="memory">When have you already lived one of these values? <span>(optional)</span></label><textarea id="memory" className="purpose-textarea" value={memory} onChange={event => setMemory(event.target.value)} placeholder="Maybe you showed up for a friend, tried something new, or gave yourself a little grace…" maxLength={3000} /></div>
        <PhotoPicker {...photoSession} />
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="step-actions"><Button variant="ghost" className="justify-self-start" onClick={() => goTo(0)}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => { if (!selected.length) { setError('Choose at least one value to carry with you.'); return; } setThought(getThought(selected)); setShowAllActions(false); if (!useCustom && !values.some(value => selected.includes(value.name) && value.action === action)) setAction(''); goTo(2); }}>Carry these with me<ArrowRight /></Button></div>
      </>}
      {step === 2 && <>
        <div className="step-heading"><div className="eyebrow"><Heart />Already within you</div><h1>You’re not starting from nothing.</h1><p>The person you want to become begins with the values you already hold.</p></div>
        <div className="value-tags">{selected.map(value => <span className="value-tag" key={value}>{value}</span>)}</div>
        {photoSession.photos.length > 0 && <section aria-label="Your visual reminders"><PhotoBoard photos={photoSession.photos} /></section>}
        <section className="affirmation" aria-label="Your personal affirmation"><Quote className="quote-icon" /><h2>{getAffirmation(selected)}</h2>
          {memory.trim() && <p>You’ve already lived these values. In your own words: “{memory.trim()}” That moment is part of your story, not something you need to earn again.</p>}
          <p>Your worth is not measured by your productivity. You don’t need to prove anything here. This is simply a chance to act on what matters to you.</p>
        </section>
        {thought && <section className="thought-card" aria-labelledby="thought-heading"><h2 id="thought-heading">A thought to carry with you</h2><blockquote>“{thought.text}”</blockquote><p>— {thought.attribution}</p></section>}
        <h2 className="action-heading">One small step. Your kind of step.</h2><p className="action-subtext">Choose something that feels doable, not impressive.</p>
        <div className="action-options" role="group" aria-label="Choose your small action">{visibleSuggestions.map(value => <Button key={value.name} variant="action" className={!useCustom && action === value.action ? 'selected' : ''} aria-pressed={!useCustom && action === value.action} onClick={() => { setAction(value.action); setUseCustom(false); setError(''); }}><span className="radio-dot" aria-hidden="true" />{value.action}</Button>)}
          {suggestions.length > 3 && <Button variant="ghost" size="sm" aria-expanded={showAllActions} onClick={() => setShowAllActions(current => !current)}>{showAllActions ? 'Show fewer suggestions' : `Explore ${suggestions.length - 3} more value-led steps`}</Button>}
          <Button variant="action" className={useCustom ? 'selected' : ''} aria-pressed={useCustom} onClick={() => { setUseCustom(true); setError(''); }}><span className="radio-dot" aria-hidden="true" />I have my own small step in mind.</Button>
        </div>
        {useCustom && <div className="field-group"><label htmlFor="custom-action" className="field-label">What’s your small step?</label><textarea autoFocus id="custom-action" className="purpose-textarea" value={customAction} onChange={event => setCustomAction(event.target.value)} placeholder="One little thing I can try is…" maxLength={500} /></div>}
        {finalAction && <section className="values-analysis" aria-labelledby="analysis-heading" aria-live="polite"><h2 id="analysis-heading">Your values in action</h2><p>{getActionAnalysis(selected, finalAction, memory)}</p></section>}
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="step-actions"><Button variant="ghost" className="justify-self-start" onClick={() => goTo(1)}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => { if (!finalAction) { setError('Choose a small action or write one of your own.'); return; } goTo(3); }}>Make a little space<ArrowRight /></Button></div>
      </>}
      {step === 3 && <>
        <div className="step-heading"><div className="eyebrow"><Leaf />A moment for what matters</div><h1>No rush. Just a beginning.</h1></div>
        <div className="value-tags">{selected.map(value => <span key={value} className="value-tag">{value}</span>)}</div>
        <h2 className="focus-action">{finalAction}</h2>
        <FocusTimer minutes={minutes} onDurationChange={setMinutes} />
        <Button variant="ghost" onClick={() => { goTo(4); }}>I gave it a try<ArrowRight /></Button>
        <div className="mt-5"><Button variant="ghost" size="sm" onClick={() => { goTo(2); }}><ArrowLeft />Choose a different step</Button></div>
      </>}
      {step === 4 && <>
        {!saved && <div className="step-heading"><div className="eyebrow"><Sprout />Let it take root</div><h1>What did this moment mean to you?</h1><p>No score, no judgment. Just a moment to notice.</p></div>}
        {!saved ? <><div className="reflection-context"><span>You made space for {selected.join(', ')}</span><p>{finalAction}</p></div>
          <div className="field-group"><label className="field-label" htmlFor="reflection">How did this action reflect your values, or the person you want to become?</label><textarea id="reflection" className="purpose-textarea" value={reflection} onChange={event => { setReflection(event.target.value); setError(''); }} placeholder="I want to be someone who… This small step felt like…" rows={5} maxLength={5000} /></div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="step-actions"><Button variant="ghost" className="justify-self-start" onClick={() => goTo(3)}><ArrowLeft />Back</Button><Button variant="reset" onClick={() => { if (!reflection.trim()) { setError('Add a few words to save your reflection, or choose “Finish without writing”.'); return; } setSaved(true); }}>Save my reflection<Check /></Button></div>
          <div className="text-center mt-4"><Button variant="ghost" size="sm" onClick={() => { setReflection(''); setSaved(true); setError(''); }}>Finish without writing</Button></div>
          <p className="privacy-note"><ShieldCheck className="inline size-3 mr-1" />Just for you. Your words stay here and clear when you leave or start again.</p>
        </> : thought && <PurposeEnding photos={photoSession.photos} thought={thought} selected={selected} action={finalAction} reflection={reflection} onBeginAgain={resetFlow} />}
      </>}
    </main>}
    <footer className="site-footer"><Sprout aria-hidden="true" /><span>PurposeLock · A prototype for values-led action</span></footer>
  </div>;
}
