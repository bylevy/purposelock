<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the PurposeLock reset as a client-side state flow at `/`, with no persistence beyond the mounted session, so personal reflections remain private and require no services.
- Define visual roles in `src/styles.css` and use shared Button variants for controls, so the editorial experience stays consistent.
- Keep value definitions, affirmation/action mappings, curated quotes, and supportive analysis in `src/lib/purpose-values.ts`, separate from the flow UI, so all steps use the same content.
- Keep countdown state inside the focus-only timer component and duration in the parent flow; unmounting clears intervals and re-entry begins a fresh countdown without losing the chosen duration.
- Manage session photos with browser object URLs in the photo hook and revoke them on removal, reset, and unmount so no uploads or retained previews are needed.
- Store the selected thought in parent React state and pass it with photos and reflection to the ending component, so the same personal reminders survive step navigation until reset.
- Model the experience as five visual Calm Path stops while allowing focus and reflection to be substeps of the action stop, so progress stays simple without coupling timer state to navigation.
