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

- Keep the flow at `/` client-side; a versioned, validated snapshot in localStorage and photo blobs in IndexedDB are written only after explicit device-saving consent, so no service receives personal content.
- Define visual roles in `src/styles.css` and use shared Button variants for controls, so the editorial experience stays consistent.
- Keep value definitions, affirmation/action mappings, curated quotes, and supportive analysis in `src/lib/purpose-values.ts`, separate from the flow UI, so all steps use the same content.
- Keep the live countdown/interval inside the focus-only timer and mirror remaining seconds in the parent snapshot; restored timers are paused and unmounting stops intervals, so time away is never treated as focus.
- Manage session photos with browser object URLs in the photo hook and revoke them on removal, reset, and unmount so no uploads or retained previews are needed.
- Store the selected thought in parent React state and pass it with photos and reflection to the ending component, so the same personal reminders survive step navigation until reset.
- Model the experience as five visual Calm Path stops while allowing focus and reflection to be substeps of the action stop, so progress stays simple without coupling timer state to navigation.
- Serialize device-storage operations and invalidate pending writes before consent withdrawal or reset; commit photo blobs before snapshot state, so stale saves cannot resurrect cleared content.
