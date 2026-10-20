import { useEffect } from 'react';

const SUFFIX = ' · AL Hospitality Group';

/**
 * Sets document.title for the page and restores the previous title on
 * unmount. Deliberately dependency-free (no react-helmet) — this is all
 * a single-page app doing client-side routing actually needs.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title}${SUFFIX}` : 'AL Hospitality Group';
    return () => { document.title = previous; };
  }, [title]);
}

/**
 * Sets the <meta name="description"> content for the page, restoring
 * the previous value on unmount. Uses the single meta tag already
 * declared in index.html rather than creating new ones per navigation.
 */
export function useMetaDescription(description) {
  useEffect(() => {
    if (!description) return undefined;
    const tag = document.querySelector('meta[name="description"]');
    if (!tag) return undefined;
    const previous = tag.getAttribute('content');
    tag.setAttribute('content', description);
    return () => { tag.setAttribute('content', previous || ''); };
  }, [description]);
}