import { useState, useEffect } from 'react';
import { isIdbUrl, getIdbId, loadMedia } from '../utils/mediaStore';

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i;

/**
 * Returns 'image', 'video', or null for a given media URL (idb:// or plain URL).
 */
export function useMediaType(url: string | undefined): 'image' | 'video' | null {
  const [type, setType] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    if (!url || url.trim() === '') { setType(null); return; }

    if (isIdbUrl(url)) {
      loadMedia(getIdbId(url)).then((entry) => {
        if (!entry) { setType(null); return; }
        setType(entry.type.startsWith('image/') ? 'image' : 'video');
      });
    } else {
      setType(IMAGE_EXTS.test(url) ? 'image' : 'video');
    }
  }, [url]);

  return type;
}
