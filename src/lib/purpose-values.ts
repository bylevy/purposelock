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
  if (selected.length > 3) return 'You can hold many things close to your heart. These values are directions you can return to, not a checklist you need to complete. One small choice is enough for today.';
  return values.filter(value => selected.includes(value.name)).map(value => value.affirmation).join(' ');
}

const thoughts = [
  { values: ['Compassion'], text: 'A small kindness is a way to make room for what matters, including yourself.', attribution: 'An original PurposeLock reflection' },
  { values: ['Growth', 'Courage'], text: 'You can grow toward what matters with one small step, even before you feel ready.', attribution: 'An original PurposeLock reflection' },
  { values: ['Family', 'Connection'], text: 'A moment of presence can be a small way of saying: you matter.', attribution: 'An original PurposeLock reflection' },
  { values: ['Health'], text: 'Caring for yourself is meaningful, even when no one else sees it.', attribution: 'An original PurposeLock reflection' },
  { values: ['Curiosity'], text: 'You can begin with a question, not an answer.', attribution: 'An original PurposeLock reflection' },
  { values: ['Integrity', 'Independence'], text: 'A choice that feels true to you does not need to impress anyone else.', attribution: 'An original PurposeLock reflection' },
];
export function getThought(selected: string[]) {
  return thoughts.find(thought => thought.values.some(value => selected.includes(value))) ?? { values: ['Growth'], text: 'One small choice is enough for today.', attribution: 'An original PurposeLock reflection' };
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
  return `You chose ${namedValues} as directions that matter to you, and made space to try this step: “${action}” ${reflection.trim() ? 'The reflection you wrote below is your own account of that moment. You might notice where the action felt connected to those values, or what you would like to try differently.' : 'Even without writing anything down, you can notice whether this step felt connected to those values and what you might want to carry forward.'} You decide what this moment means; it does not have to prove anything about your worth.`;
}

export function getNextSteps(selected: string[], action: string) {
  const matched = values.find(value => selected.includes(value.name) && value.action === action);
  const direction = matched?.name.toLowerCase() ?? selected[0]?.toLowerCase() ?? 'what matters to you';
  return [
    `This week, try “${action}” again, or make it smaller if that feels kinder. Let ${direction} be a direction, not a deadline.`,
    'If it feels helpful, jot down your thought to carry with you or keep one of your own photos somewhere visible.',
    `After another try, take a quiet moment to ask: how did this connect with ${direction}, and what would I like to try next?`,
  ];
}
