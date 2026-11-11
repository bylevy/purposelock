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
  if (selected.length > 1) return `${selected.length} values chose you back today. You only need to honor one of them next.`;
  return values.find(value => selected.includes(value.name))?.affirmation ?? 'Starting small still counts as starting.';
}

const ATTRIBUTION = 'An original PurposeLock reflection';
const ORDER = values.map(value => value.name);

const singleThoughts: Record<string, string> = {
  Growth: 'Who you are becoming is built in the unremarkable minutes no one applauds.',
  Compassion: 'Softness toward yourself is not a reward for finishing; it is how you keep going.',
  Family: 'Belonging is renewed in ordinary gestures: a call returned, a chair pulled closer.',
  Health: 'Your body has carried you this far. Today it asks for patience, not perfection.',
  Connection: 'Someone out there would feel lighter just hearing from you.',
  Courage: 'Fear can ride along. It just does not get to hold the map.',
  Curiosity: 'Wonder is a door you can open from wherever you are standing.',
  Integrity: 'When your actions and your quiet convictions meet, you stop arguing with yourself.',
  Independence: 'Trusting your own judgment is a skill, and every honest choice is practice.',
};

const pairThoughts: Record<string, string> = {
  'Growth+Courage': 'Stretching past the familiar feels shaky because it is new, not because you are wrong.',
  'Compassion+Connection': 'Tenderness travels: the gentleness you show yourself shapes how you show up for others.',
  'Family+Connection': 'The people who know your laugh deserve your attention, not just your availability.',
  'Health+Compassion': 'Rest taken kindly is not falling behind; it is tending the ground you grow from.',
  'Integrity+Independence': 'Your compass works best when you stop borrowing other people’s north.',
  'Growth+Curiosity': 'Questions are the seeds; learning is simply what happens when you water them.',
  'Courage+Integrity': 'Standing by what you believe gets steadier each time you say it out loud.',
  'Family+Compassion': 'Home grows warmer when patience is offered before it is earned.',
  'Health+Growth': 'Strength gathers slowly, like rings in a tree, one season of care at a time.',
  'Connection+Courage': 'Reaching out first is a brave act dressed up as an ordinary message.',
};

const verbs: Record<string, string> = {
  Growth: 'grow', Compassion: 'care gently', Family: 'show up for home', Health: 'tend your wellbeing', Connection: 'stay close to others',
  Courage: 'act bravely', Curiosity: 'stay open', Integrity: 'stay true', Independence: 'trust your own voice',
};

function listJoin(items: string[]) {
  return items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function getThought(selected: string[]) {
  const chosen = ORDER.filter(name => selected.includes(name));
  if (chosen.length === 0) return { values: ['Growth'], text: singleThoughts['Growth'] ?? '', attribution: ATTRIBUTION };
  if (chosen.length === 1) return { values: chosen, text: singleThoughts[chosen[0] ?? 'Growth'] ?? '', attribution: ATTRIBUTION };
  if (chosen.length === 2) {
    const pair = pairThoughts[`${chosen[0]}+${chosen[1]}`] ?? pairThoughts[`${chosen[1]}+${chosen[0]}`];
    if (pair) return { values: chosen, text: pair, attribution: ATTRIBUTION };
  }
  if (chosen.length === ORDER.length) return { values: chosen, text: 'Every value you hold is part of one life; today, a single honest step can serve them all.', attribution: ATTRIBUTION };
  const names = chosen.map(name => name.toLowerCase());
  const ways = chosen.map(name => verbs[name] ?? name.toLowerCase());
  const text = chosen.length <= 3
    ? `The urge to ${listJoin(ways)} comes from the same root, so one small step can nourish ${chosen.length === 2 ? 'both' : 'all three'}.`
    : `${listJoin(names).replace(/^./, c => c.toUpperCase())} are not separate errands; they are one way of living, practiced a little at a time.`;
  return { values: chosen, text, attribution: ATTRIBUTION };
}
export function getActionAnalysis(selected: string[], action: string, memory: string) {
  const matched = values.find(value => value.action === action && selected.includes(value.name));
  const connection = matched
    ? `This step offers a small way to practice ${matched.name.toLowerCase()}: ${matched.description.toLowerCase()}`
    : `Your chosen step can be a chance to practice what ${selected.length > 3 ? 'these values' : selected.join(', ')} means to you. You decide which connection feels most true.`;
  return `${connection} ${memory.trim() ? 'The memory you shared is a reminder of a moment when you felt connected to what matters. This action can be another moment, without needing to repeat or outdo the past.' : 'You do not have to act on every value at once. Making room for one today can be enough.'} This is an invitation, not a verdict about who you are.`;
}

export function getCompletionAnalysis(selected: string[], action: string, reflection: string) {
  const namedValues = selected.map(value => value.toLowerCase()).join(', ');
  const matched = values.find(value => value.action === action && selected.includes(value.name));
  return `You made space to try a step toward ${matched?.name.toLowerCase() ?? namedValues}. ${reflection.trim() ? 'Your reflection is a place to notice how it connected with what matters, or what you might try differently.' : 'You can quietly notice what felt connected to your values, and what you might try differently.'} Your worth was never the task.`;
}

export function getNextSteps(selected: string[], action: string) {
  const matched = values.find(value => selected.includes(value.name) && value.action === action);
  const direction = matched?.name.toLowerCase() ?? selected[0]?.toLowerCase() ?? 'what matters to you';
  return [
    `Try this step again this week, or a smaller version, as a way to practice ${direction}.`,
    'Set one photo as your lock screen or tape a note by your door as a visual cue.',
    `After another try, ask: what felt connected to ${direction}?`,
  ];
}
