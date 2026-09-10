const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

// `'` stays literal: no attribute here is single-quoted, and the prose is full of apostrophes.
export const escapeHtml = (value: string): string => value.replace(/[&<>"]/g, character => HTML_ESCAPES[character]);
