import { Sprout, Heart, House, Leaf, Users, Mountain, Compass, ShieldCheck, Sun } from 'lucide-react';
export const values = [
  { name: 'Growth', description: 'Making room to learn and become.', icon: Sprout, affirmation: 'You are someone who makes room to grow.', action: 'Spend a few minutes learning something that sparks your interest.' },
  { name: 'Compassion', description: 'Meeting yourself and others with kindness.', icon: Heart, affirmation: 'Your kindness matters, including the kindness you offer yourself.', action: 'Write yourself a kind note, as you would for a friend.' },
  { name: 'Family', description: 'Caring for the people you call home.', icon: House, affirmation: 'The care you bring to your family is already meaningful.', action: 'Send a thoughtful message to someone you call family.' },
  { name: 'Health', description: 'Caring for your body and mind.', icon: Leaf, affirmation: 'You deserve care, rest, and space to feel well.', action: 'Drink a glass of water and take a few slow, grounding breaths.' },
  { name: 'Connection', description: 'Being present with others.', icon: Users, affirmation: 'Your presence is enough to make a connection meaningful.', action: 'Reach out to someone and ask how they are really doing.' },
  { name: 'Courage', description: 'Taking a step, even with uncertainty.', icon: Mountain, affirmation: 'Courage can be quiet; a small beginning still counts.', action: 'Take the first tiny step toward something you have been putting off.' },
  { name: 'Curiosity', description: 'Staying open to wonder and discovery.', icon: Compass, affirmation: 'Your questions and sense of wonder are worth making space for.', action: 'Notice three things around you and explore one with curiosity.' },
  { name: 'Integrity', description: 'Living in a way that feels true to you.', icon: ShieldCheck, affirmation: 'You can return to what feels honest and true, one choice at a time.', action: 'Write down one choice that would feel true to you today.' },
  { name: 'Independence', description: 'Trusting your own voice and choices.', icon: Sun, affirmation: 'Your voice matters, and you are allowed to choose your own path.', action: 'Make one small choice today based on what you genuinely need.' },
];
export function getAffirmation(selected: string[]) {
  return values.filter(value => selected.includes(value.name)).map(value => value.affirmation).join(' ');
}
