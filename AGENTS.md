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
- Keep value definitions and affirmation/action mappings in `src/lib/purpose-values.ts`, separate from the flow UI, so all steps use the same content.
