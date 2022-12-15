const safeHtmlSymbol = Symbol('async-to-dom safe html symbol');

export const safeHtml = (string) => ({
  [safeHtmlSymbol]: string,
  toString: () => string,
});

export const getSafeString = (safeString) => safeString[safeHtmlSymbol];

export const isSafeHtml = (safe) => !!safe?.[safeHtmlSymbol];
