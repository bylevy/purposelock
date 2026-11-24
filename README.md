# Purposelock

Build a polished, responsive website prototype called PurposeLock. This is for a college class project focused on self-affirmation, core values, purpose, and long-term "be goals". The website should work publicly without requiring users to sign in. No database or API integrations are needed; keep all interaction client-side and in memory/session only.

Design direction: warm editorial wellness aesthetic, cream/off-white background, deep forest green, sage, muted gold accents, elegant serif headlines paired with clean sans-serif UI, generous whitespace, rounded cards, mobile responsive, professional and coherent. Avoid generic SaaS dashboard appearance.

Build a complete interactive multi-step experience:
1) Welcome screen with headline "You don't have to feel ready to begin.", subtext that helps people reconnect with what matters and take one small step, CTA "Start my reset", and attractive abstract nature/sun illustration using CSS or SVG.
2) Values selection: users choose up to 3 from Growth, Compassion, Family, Health, Connection, Courage, Curiosity, Integrity, Independence. Include short descriptions and an optional textarea prompt asking for a memory of a time they already demonstrated one value. Validate at least one value.
3) Personalized affirmation: generate affirmation copy from selected values, reflect their past memory if entered, and make clear they do not need to prove worth through productivity. Let users choose one small action from suggested options or write their own.
4) Focus screen: selected action shown prominently, a working 5-minute timer with start/pause/resume/reset, and button to finish early ("I gave it a try"). Do not force user to wait for timer.
5) Reflection screen: ask how the action reflects selected values or the person they want to become, textarea, save feedback, and start-again reset flow.

Include a small progress indicator for steps 1-3, accessible labels and buttons, no login, no fake app blocking claim. Explain focus timer is a gentle invitation not a test. Add subtle footer "PurposeLock · A prototype for values-led action". Ensure all buttons work and the complete user flow can be finished. No external stock images needed; create attractive CSS/SVG illustration. Make the site deployment-ready.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://purposelock.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/43680286-b4ed-4581-874a-840d889a553c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
