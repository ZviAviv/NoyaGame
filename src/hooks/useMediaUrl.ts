import { useState, useEffect } from 'react';
import { isIdbUrl, getIdbId, loadMedia } from '../utils/mediaStore';

/**
 * Resolves a URL that might be an idb:// reference to an object URL.
 * For regular URLs, returns them as-is.
 * For idb:// URLs, loads the blob from IndexedDB and creates an object URL.
 */
export function useMediaUrl(url: string | undefined): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  useEffect(() => {
    if (!url || url.trim() === '') {
      setResolvedUrl('');
      return;
    }

    if (!isIdbUrl(url)) {
      setResolvedUrl(url);
      return;
    }

    let objectUrl = '';
    const id = getIdbId(url);

    loadMedia(id).then((entry) => {
      if (entry) {
        objectUrl = URL.createObjectURL(entry.blob);
        setResolvedUrl(objectUrl);
      } else {
        setResolvedUrl('');
      }
    });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return resolvedUrl;
}
