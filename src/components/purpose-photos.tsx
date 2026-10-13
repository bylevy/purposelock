import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Photo = { url: string; name: string };
export function useSessionPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState('');
  const current = useRef<Photo[]>([]);
  useEffect(() => () => { current.current.forEach(photo => URL.revokeObjectURL(photo.url)); }, []);
  function addPhotos(files: FileList | null) {
    if (!files) return;
    const images = Array.from(files).filter(file => file.type.startsWith('image/') && file.size <= 15 * 1024 * 1024);
    setPhotoError(images.length < files.length ? 'Please choose image files up to 15 MB each. Other files were skipped.' : '');
    const added = images.map(file => ({ url: URL.createObjectURL(file), name: file.name }));
    current.current = [...current.current, ...added]; setPhotos(current.current);
  }
  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    current.current = current.current.filter(photo => photo.url !== url); setPhotos(current.current);
  }
  function clearPhotos() {
    current.current.forEach(photo => URL.revokeObjectURL(photo.url));
    current.current = []; setPhotos([]); setPhotoError('');
  }
  return { photos, photoError, addPhotos, removePhoto, clearPhotos };
}

export function PhotoBoard({ photos, onRemove }: { photos: Photo[]; onRemove?: (url: string) => void }) {
  return <div className="photo-board" aria-label="Your values photo board">{photos.map((photo, index) => <figure className="photo-preview" key={photo.url}>
    <img src={photo.url} alt={`Values reminder ${index + 1}: ${photo.name}`} onError={event => { event.currentTarget.alt = `Preview unavailable: ${photo.name}. Try a JPEG or PNG image.`; }} />
    {onRemove && <Button className="photo-remove" variant="secondary" size="icon" aria-label={`Remove photo ${index + 1}: ${photo.name}`} title={`Remove ${photo.name}`} onClick={() => onRemove(photo.url)}><X /></Button>}
  </figure>)}</div>;
}

export function PhotoPicker({ photos, photoError, addPhotos, removePhoto }: ReturnType<typeof useSessionPhotos>) {
  const input = useRef<HTMLInputElement>(null);
  return <section className="field-group" aria-labelledby="photos-heading">
    <h2 className="field-label" id="photos-heading">Your visual reminders <span>(optional)</span></h2>
    <p className="action-subtext">People, places, moments, or hopes.</p>
    <input className="sr-only" ref={input} id="values-photos" type="file" accept="image/*" multiple aria-label="Add photos that represent your values" onChange={event => { addPhotos(event.target.files); event.target.value = ''; }} />
    <Button variant="outline" onClick={() => input.current?.click()}><ImagePlus />Add photos</Button>
    {photos.length > 0 && <PhotoBoard photos={photos} onRemove={removePhoto} />}
    {photoError && <p role="alert" className="error-message">{photoError}</p>}
    <p className="privacy-note">Only in this visit. Never uploaded. Cleared when you leave or begin again.</p>
  </section>;
}