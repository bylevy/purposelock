import { Check, Flower2, Leaf, Sun } from 'lucide-react';

const stops = ['Values', 'Reminders', 'Your thought', 'Your step', 'Postcard'];

export function CalmPath({ active }: { active: number }) {
  return <nav className="calm-path" aria-label="Your path">
    <div className="path-scene" aria-hidden="true">
      <Sun className="path-sun" />
      <svg viewBox="0 0 720 116" preserveAspectRatio="none">
        <path className="path-hill path-hill-far" d="M0 77C112 36 195 61 285 69S475 23 720 66V116H0Z" />
        <path className="path-hill path-hill-near" d="M0 94C144 72 212 99 353 83S570 61 720 90V116H0Z" />
        <path className="path-line" d="M38 88C165 104 195 48 330 69S512 106 682 49" />
      </svg>
      <Leaf className="path-leaf" /><Flower2 className="path-flower" />
    </div>
    <ol className="path-stops">
      {stops.map((label, index) => {
        const stop = index + 1;
        const complete = stop < active;
        return <li key={label} className={stop === active ? 'active' : complete ? 'complete' : ''} aria-current={stop === active ? 'step' : undefined}>
          <span className="path-stone">{complete ? <Check /> : stop}</span>
          <span className="path-label">{label}</span>
        </li>;
      })}
    </ol>
  </nav>;
}