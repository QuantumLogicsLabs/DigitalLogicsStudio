export const isPrerendering = () =>
  typeof navigator !== "undefined" && /ReactSnap/i.test(navigator.userAgent);
