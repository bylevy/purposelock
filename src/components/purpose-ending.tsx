import { useState } from 'react';
import { Sprout, ImagePlus, Leaf, Stamp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionPhotos } from '@/components/purpose-photos';
import { getThought, getCompletionAnalysis, getNextSteps } from '@/lib/purpose-values';

type EndingProps = {
  photos: ReturnType<typeof useSessionPhotos>['photos'];
  thought: ReturnType<typeof getThought>;
  selected: string[];
  action: string;
  reflection: string;
  onBeginAgain: () => void;
};

export function PurposeEnding({ photos, thought, selected, action, reflection, onBeginAgain }: EndingProps) {
  const [turned, setTurned] = useState(false);
  return <section className="purpose-ending" aria-labelledby="ending-heading">
    <div className="step-heading destination-heading"><div className="eyebrow"><Leaf />You arrived</div><h1 id="ending-heading">What you did it all for</h1><p>A small keepsake of what matters to you.</p></div>
    <div className={`values-postcard ${turned ? 'is-turned' : ''}`}>
      {!turned ? <article className="postcard-face postcard-front" aria-label="Front of your Values Postcard">
        <div className="postcard-topline"><span>Values Postcard</span><Stamp aria-hidden="true" /></div>
        <div className={`postcard-collage collage-${Math.min(photos.length, 4)}`}>
          {photos.length ? photos.map((photo, index) => <figure key={photo.url} className={`postcard-photo photo-${index % 4}`}><img src={photo.url} alt={`Your reminder ${index + 1}: ${photo.name}`} /></figure>) : <div className="postcard-photo-placeholder"><ImagePlus aria-hidden="true" /><span>Add a meaningful photo next time</span></div>}
        </div>
        <div className="postcard-values" aria-label={`Your values: ${selected.join(', ')}`}>{selected.map(value => <span key={value}>{value}</span>)}</div>
        <blockquote className="postcard-quote">“{thought.text}”</blockquote>
        <p className="postcard-attribution">— {thought.attribution}</p>
        <div className="postcard-action"><span>Your small step</span><strong>{action}</strong></div>
        <Leaf className="postcard-botanical" aria-hidden="true" />
      </article> : <article className="postcard-face postcard-back" aria-label="Back of your Values Postcard">
        <div className="postcard-topline"><span>A note to yourself</span><Leaf aria-hidden="true" /></div>
        <section aria-labelledby="ending-analysis-heading"><h2 id="ending-analysis-heading">Your values in action</h2><p>{getCompletionAnalysis(selected, action, reflection)}</p></section>
        <section className="ending-next-steps" aria-labelledby="next-steps-heading"><h2 id="next-steps-heading">Your next steps</h2><ul>{getNextSteps(selected, action).map(suggestion => <li key={suggestion}>{suggestion}</li>)}</ul></section>
        {reflection.trim() && <section className="ending-reflection" aria-labelledby="saved-reflection-heading"><h2 id="saved-reflection-heading">What you noticed</h2><blockquote>{reflection.trim()}</blockquote></section>}
      </article>}
    </div>
    <div className="postcard-turn"><Button variant="outline" aria-pressed={turned} onClick={() => setTurned(current => !current)}>{turned ? <ArrowLeft /> : <ArrowRight />}{turned ? 'Turn postcard back' : 'Turn postcard over'}</Button></div>
    <div className="ending-actions"><Button variant="reset" onClick={onBeginAgain}>Begin again<Sprout /></Button><p className="privacy-note">Your photos and words stay here for this visit. Beginning again clears them, not your worth.</p></div>
  </section>;
}