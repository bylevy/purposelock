import { useState } from 'react';
import { HardDrive, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

export function DevicePrivacy({ saving, status, busy, onEnable, onDisable, onClear }: {
  saving: boolean; status: string; busy: boolean;
  onEnable: () => void; onDisable: () => Promise<void>; onClear: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(true);
  const [confirmation, setConfirmation] = useState<'disable' | 'clear' | null>(null);
  return <section className="device-privacy" aria-label="Device privacy">
    <div className="device-privacy-top"><span role="status"><ShieldCheck aria-hidden="true" />{status}</span><Button variant="ghost" size="sm" aria-expanded={expanded} onClick={() => setExpanded(current => !current)}>Privacy & saving</Button></div>
    {expanded && <div className="device-privacy-details">
      <p>Saving is optional and off by default. Your values, words, photos, timer, and postcard can stay in this browser on this device only. Nothing you enter is uploaded. No account or personal details required.</p>
      <p>Anyone using this browser profile may see saved content. There is no cloud backup; clearing browser data or switching browsers/devices may lose it. A resumed timer stays paused.</p>
      <div className="device-privacy-actions"><Button variant={saving ? 'secondary' : 'outline'} size="sm" disabled={busy || saving} onClick={onEnable}><HardDrive />Save my progress on this device</Button><Button variant="ghost" size="sm" aria-pressed={!saving} disabled={busy} onClick={() => { if (saving) setConfirmation('disable'); else setExpanded(false); }}>Don’t save</Button><Button variant="ghost" size="sm" disabled={busy} onClick={() => setConfirmation('clear')}><Trash2 />Clear my saved progress</Button></div>
    </div>}
    <AlertDialog open={confirmation !== null} onOpenChange={open => { if (!open && !busy) setConfirmation(null); }}>
      <AlertDialogContent className="privacy-dialog"><AlertDialogTitle>{confirmation === 'disable' ? 'Turn off device saving?' : 'Clear your progress?'}</AlertDialogTitle><AlertDialogDescription>{confirmation === 'disable' ? 'Delete saved words, progress, and photos from this browser. Your current visit stays open in memory, but will not resume after you leave.' : 'Delete all PurposeLock saved progress and photos from this browser and start fresh. This also clears your current visit and postcard. This cannot be undone.'}</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline" disabled={busy}>Keep it</Button></AlertDialogCancel><Button variant="reset" disabled={busy} onClick={async () => { if (confirmation === 'disable') await onDisable(); else await onClear(); setConfirmation(null); }}>{busy ? 'Clearing…' : confirmation === 'disable' ? 'Turn off & delete saved copy' : 'Clear everything'}</Button></AlertDialogFooter></AlertDialogContent>
    </AlertDialog>
  </section>;
}