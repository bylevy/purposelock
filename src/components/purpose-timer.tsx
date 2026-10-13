import { useEffect, useRef, useState } from 'react';
import { Clock3, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FocusTimer({ minutes, onDurationChange }: { minutes: number; onDurationChange: (minutes: number) => void }) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [custom, setCustom] = useState(![5, 10, 15, 25].includes(minutes));
  const [customMinutes, setCustomMinutes] = useState(String(minutes));
  const deadline = useRef(0);
  const validCustom = /^\d+$/.test(customMinutes) && Number(customMinutes) >= 1 && Number(customMinutes) <= 120;
  const valid = !custom || validCustom;

  useEffect(() => {
    if (!running) return;
    function tick() {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining); if (remaining === 0) setRunning(false);
    }
    tick(); const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [running]);

  function reset(duration = minutes) { setRunning(false); setHasStarted(false); setSeconds(duration * 60); }
  function chooseDuration(duration: number) { reset(duration); onDurationChange(duration); }
  function toggle() {
    if (running) { setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))); setRunning(false); }
    else if (valid && seconds > 0) { deadline.current = Date.now() + seconds * 1000; setRunning(true); setHasStarted(true); }
  }
  return <>
    <fieldset className="duration-picker"><legend><Clock3 className="inline size-3 mr-2" />Make space for {minutes} {minutes === 1 ? 'minute' : 'minutes'}</legend>
      <div className="duration-presets">{[5, 10, 15, 25].map(duration => <Button key={duration} variant={!custom && minutes === duration ? 'secondary' : 'ghost'} size="sm" aria-pressed={!custom && minutes === duration} onClick={() => { setCustom(false); setCustomMinutes(String(duration)); chooseDuration(duration); }}>{duration} min</Button>)}<Button variant={custom ? 'secondary' : 'ghost'} size="sm" aria-pressed={custom} onClick={() => { setCustom(true); setCustomMinutes(String(minutes)); reset(); }}>Custom</Button></div>
      {custom && <div className="custom-duration"><label htmlFor="custom-minutes">Minutes <span>(1–120)</span></label><input id="custom-minutes" type="number" inputMode="numeric" min={1} max={120} step={1} value={customMinutes} aria-invalid={!validCustom} aria-describedby={!validCustom ? 'duration-error' : undefined} onChange={event => { const text = event.target.value; setCustomMinutes(text); reset(); if (/^\d+$/.test(text) && Number(text) >= 1 && Number(text) <= 120) chooseDuration(Number(text)); }} />{!validCustom && <p id="duration-error" className="error-message" role="alert">Choose a whole number from 1 to 120 minutes.</p>}</div>}
    </fieldset>
    <div className="timer-wrap"><svg className="timer-ring" viewBox="0 0 230 230" aria-hidden="true"><circle className="timer-track" cx="115" cy="115" r="108" /><circle className="timer-progress" cx="115" cy="115" r="108" strokeDasharray={678.584} strokeDashoffset={678.584 * (1 - seconds / (minutes * 60))} /></svg><div><div className="timer-digits" role="timer" aria-label={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div><div className="timer-state" aria-live="polite">{seconds === 0 ? 'A little space, made' : running ? 'One moment at a time' : hasStarted ? 'Take your time' : 'Your time to begin'}</div></div></div>
    <div className="timer-controls"><Button variant="reset" onClick={toggle} disabled={!valid || seconds === 0}>{running ? <Pause /> : <Play />}{running ? 'Pause' : hasStarted ? 'Resume' : 'Start my focus'}</Button><Button variant="outline" size="icon" aria-label="Reset timer" title="Reset timer" onClick={() => reset()}><RotateCcw /></Button></div>
    <p className="timer-note">An invitation, not a test. Stop whenever you like.</p>
  </>;
}