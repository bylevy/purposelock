import { Sprout, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoBoard, useSessionPhotos } from '@/components/purpose-photos';
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
  return <section className="purpose-ending" aria-labelledby="ending-heading">
    <div className="step-heading"><h1 id="ending-heading">What you did it all for</h1></div>
    <section className="ending-gallery" aria-label="Your personal reminders">
      {photos.length ? <PhotoBoard photos={photos} /> : <div className="ending-photo-empty"><ImagePlus aria-hidden="true" /><p>Next time, you might bring a photo of someone, somewhere, or something that reminds you of what matters. It’s always optional.</p></div>}
    </section>
    <section className="thought-card" aria-labelledby="ending-thought-heading"><h2 id="ending-thought-heading">A thought to carry with you</h2><blockquote>“{thought.text}”</blockquote><p>— {thought.attribution}</p></section>
    <section className="values-analysis" aria-labelledby="ending-analysis-heading"><h2 id="ending-analysis-heading">Your values in action</h2><p>{getCompletionAnalysis(selected, action, reflection)}</p></section>
    <section className="ending-next-steps" aria-labelledby="next-steps-heading"><h2 id="next-steps-heading">Your next steps</h2><ul>{getNextSteps(selected, action).map(suggestion => <li key={suggestion}>{suggestion}</li>)}</ul></section>
    {reflection.trim() && <section className="ending-reflection" aria-labelledby="saved-reflection-heading"><h2 id="saved-reflection-heading">Your saved reflection</h2><blockquote className="saved-reflection">{reflection.trim()}</blockquote></section>}
    <div className="ending-actions"><Button variant="reset" onClick={onBeginAgain}>Begin again<Sprout /></Button><p className="privacy-note">Your photos and words stay here for this visit. Beginning again clears them, not your worth.</p></div>
  </section>;
}