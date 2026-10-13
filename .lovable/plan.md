# PurposeLock: lower-reading interaction concepts

## What the current flow asks of students

The existing experience has a strong calm foundation: a welcoming first screen, tap-to-select value cards, optional memory and photos, a personalized affirmation and quote, action choices, an adjustable focus timer, reflection, and the “What you did it all for” ending.

The main opportunity is pacing. Values, memory, photos, affirmation, quote, action analysis, and action selection currently appear in two long screens. The ending also presents several text sections at once. For an overwhelmed student, the design can preserve all meaning while revealing one decision or reflection at a time.

## Concept 1 — One Quiet Choice at a Time

A short sequence of single-purpose screens. This is the clearest and lowest-reading direction.

### Screen-by-screen changes

1. **Welcome**
   - Keep the landscape and headline: “You don’t have to feel ready to begin.”
   - Reduce supporting copy to: “Find what matters. Take one small step.”
   - Primary action: “Begin”.
   - Replace the three explanatory blocks below the landscape with three small icon labels: “Choose · Try · Reflect”.

2. **Values**
   - Heading: “What matters today?”
   - Show the existing nine values as large tap cards with icon + value name only.
   - On selection, briefly reveal its one-line description inside that card.
   - Keep unlimited selection and a compact live selection tray along the bottom.
   - Primary action appears after one selection: “These feel right”.

3. **Personal anchor**
   - Heading: “Bring one reminder”
   - Two equal visual choices: “Add a photo” and “Remember a moment”.
   - Either opens the existing local photo picker or one short text field.
   - “Skip for now” remains equally visible; no required writing.
   - If photos are added, show a swipeable strip rather than a full gallery.

4. **Personal reveal**
   - Start with selected value chips, then reveal the affirmation with a soft fade after a tap: “Show me”.
   - Next tap reveals the same personal quote: “One thought to carry”.
   - Keep “Your worth is not measured by productivity” as one short fixed line.
   - No long analysis on this screen.

5. **Action**
   - Heading: “What feels doable?”
   - Show three suggested actions as large tap cards, one sentence each.
   - Secondary action: “Write my own”.
   - After selection, show one concise connection: “This is one way to practice [value].”
   - Primary action: “Make space for this”.

6. **Focus**
   - Keep timer presets and custom duration, but show presets first as four large chips; place “Custom” beneath them.
   - After duration selection, visually collapse the picker so the chosen action and timer dominate.
   - Keep Start/Pause/Resume/Reset and “I gave it a try”.
   - Keep the gentle-not-a-test message as a single line.

7. **Reflection**
   - Heading: “What did you notice?”
   - Begin with three optional tap prompts: “It felt true”, “It felt hard”, “I want to try again”.
   - Tapping one can seed a short sentence starter, while the student may write freely or finish without writing.

8. **Ending**
   - Keep the exact heading “What you did it all for”.
   - Reveal in order: photos, quote, reflection, then one concise values/action connection.
   - Present “Your next steps” as two tap-sized suggestion rows rather than a paragraph list.
   - Keep “Begin again”; only that action clears session photos and words.

### Interaction details
- Replace the numbered progress labels with five calm leaf marks: Values, Anchor, Action, Focus, Reflect. Completed marks fill with sage; no percentage or score.
- Use gentle 150–250ms fades and vertical reveals, respecting reduced-motion settings.
- Preserve back navigation and all current optional paths.
- Keep every choice keyboard-operable, with clear selected states and live announcements.

### Tradeoffs
- **Strengths:** Lowest reading burden; one decision per screen; strongest fit for overwhelmed students; easiest mobile scanning.
- **Risks:** More screens and taps; students who prefer seeing everything at once may feel the flow is slower.

## Concept 2 — Values Postcard

The student gradually builds one personal visual postcard. Photos are the emotional anchor throughout the flow.

### Screen-by-screen changes

1. **Welcome**
   - Keep the current headline and landscape.
   - Copy: “Make a small reminder of what matters.”
   - Action: “Create my reset”.

2. **Choose the postcard theme**
   - Heading: “Pick what belongs on it”
   - Values appear as icon tiles around a blank cream postcard preview.
   - Each tap adds a small handwritten-style value label to the postcard.
   - Descriptions appear only on press/focus or through an accessible details control.

3. **Add an image or memory**
   - The postcard preview remains visible.
   - Primary choices: “Add photos” or “Add a few words”.
   - Uploaded photos become a simple collage inside the postcard; text becomes one short caption.
   - “Keep it simple” skips both.

4. **Turn it over**
   - A button labeled “Turn it over” creates the small reveal.
   - The reverse shows the personalized affirmation and selected quote, with minimal attribution.
   - A single line reinforces worth beyond productivity.

5. **Choose the action on the postcard**
   - Heading: “One thing this can remind you to do”
   - Three action cards appear below the postcard; tapping one writes it onto the postcard footer.
   - Custom action remains available.

6. **Focus**
   - The postcard stays pinned above a simplified timer.
   - Preset duration chips sit directly under the action.
   - Controls and early finish remain unchanged in function.

7. **Reflection**
   - Prompt: “Add one note from this moment”
   - One compact field appears on the postcard itself.
   - “Leave it blank” remains available.

8. **Ending**
   - Exact heading: “What you did it all for”.
   - Display the finished postcard prominently: photo collage, values, quote, action, and optional reflection.
   - Place two brief next-step suggestions below it.
   - Keep “Begin again”.

### Interaction details
- Use a restrained paper-turn transition, not a realistic 3D flip; reduced motion swaps instantly.
- The postcard updates immediately after every choice, providing motivation without points or completion pressure.
- Photos remain browser-only and object URLs persist until “Begin again” or unmount.
- Provide a linear screen-reader reading order independent of the visual collage.

### Tradeoffs
- **Strengths:** Most memorable and emotionally engaging; photos have a purpose from the beginning; ending feels earned and cohesive.
- **Risks:** More visual design complexity; collage accessibility and many-photo layouts need careful handling; less suitable for students who add no photo unless the typography-only postcard is equally polished.

## Concept 3 — Calm Path

A lightly exploratory path where students tap one stepping stone at a time; it feels playful without becoming a game.

### Screen-by-screen changes

1. **Welcome**
   - Keep the landscape and headline.
   - Add one short cue: “Take the next small step.”
   - Action: “Step in”.

2. **Value stepping stones**
   - Heading: “Which directions feel like yours?”
   - Values appear as large organic tiles in a gentle vertical path.
   - Tap selects; the tile settles into sage and adds a small leaf to the path.
   - Descriptions reveal only for selected values.

3. **Choose a compass point**
   - From all selected values, ask: “Which one do you need most today?”
   - This does not remove other values; it selects one lead value for the quote, action suggestions, and concise analysis.
   - This reduces clutter while preserving unlimited value selection.

4. **Visual reminder**
   - Heading: “What can help you remember?”
   - Large photo action first, then “Write a memory” and “Skip”.
   - A selected photo becomes the soft visual backdrop for the next screens; without a photo, use the existing illustrated landscape.

5. **Reveal**
   - Present one affirmation line, then a “Carry this thought” quote card.
   - Swipe or tap “Next small step” to reveal three actions tied first to the lead value, with other selected values available under “More ideas”.

6. **Focus clearing**
   - Selected action sits over the photo or landscape backdrop.
   - Duration choices appear as “A moment · 5”, “A pause · 10”, “A little space · 15”, “A focus block · 25”, plus custom.
   - Once started, controls remain but nonessential content quiets visually.

7. **Reflection fork**
   - Ask: “Where did this step lead?”
   - Three nonjudgmental choices: “Closer”, “Not sure yet”, “Somewhere else”.
   - Each reveals a different optional short prompt; all can finish without writing.

8. **Ending**
   - Exact heading: “What you did it all for”.
   - Show the photo gallery first, then the persistent quote and optional reflection.
   - Analysis references all chosen values, with the lead value as today’s direction—not as a personality label.
   - Show 2–3 practical next steps and “Begin again”.

### Interaction details
- Use path growth only as navigation feedback, never as a reward meter.
- No streaks, points, badges, confetti, locked steps, or failure states.
- The lead-value choice is always reversible and clearly described as “for today”.
- Maintain visible text labels alongside icons for accessibility.

### Tradeoffs
- **Strengths:** Most playful option; creates a sense of movement without pressure; lead value makes personalization sharper and shorter.
- **Risks:** Asking for a lead value adds one decision; organic layouts require extra responsive and keyboard-order care; metaphor may feel less direct than Concept 1.

## Recommendation

Proceed with **Concept 1: One Quiet Choice at a Time**, borrowing the persistent visual postcard preview from Concept 2 only on the ending screen. It removes the most reading while keeping the current purpose immediately understandable, preserves unlimited values, and introduces the least interaction complexity.

## Technical boundaries for any chosen concept

- Keep the whole flow client-side at `/`; no login, database, API, or upload.
- Retain photos, selected values, the exact chosen quote, action, and reflection in parent React state until “Begin again”.
- Keep timer countdown isolated so navigating away stops its interval safely.
- Continue using the existing semantic colors, typography, shared controls, focus treatment, responsive breakpoints, and reduced-motion support.
- Test keyboard and screen-reader labels, long custom actions, many selected values, multiple photos, no-photo and no-reflection paths, timer controls, back navigation, desktop, and mobile.
