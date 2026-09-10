const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

// `'` is deliberately absent: no attribute here is single-quoted, and literal
// apostrophes keep the prerendered prose readable to whatever parses it.
export const escapeHtml = (value: string): string => value.replace(/[&<>"]/g, character => HTML_ESCAPES[character]);
