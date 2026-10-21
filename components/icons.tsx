// One icon set, 24px grid, 1.75 stroke, round caps.
import type { ReactNode } from 'react';

const s = (d: ReactNode, i?: string) => (
  <svg className="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-i={i}>{d}</svg>
);

// Filled glyphs (solid shapes read better than thin outlines at small sizes on cards and chips).
const f = (d: ReactNode) => (
  <svg className="ic ic--fill" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">{d}</svg>
);

export const F = {
  pin: f(<path fillRule="evenodd" d="M12 2.2a7.6 7.6 0 0 0-7.6 7.6c0 5.7 6.6 11.4 7 11.7a.9.9 0 0 0 1.2 0c.4-.3 7-6 7-11.7A7.6 7.6 0 0 0 12 2.2zm0 10.4a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" />),
  phone: f(<path d="M7 2.8h2.6c.5 0 .9.3 1 .8l.9 3.5c.1.4 0 .8-.3 1.1L9.6 9.7a12.2 12.2 0 0 0 4.7 4.7l1.5-1.6c.3-.3.7-.4 1.1-.3l3.5.9c.5.1.8.5.8 1V17c0 2.3-1.9 4.2-4.2 4C9.1 20.4 3.6 14.9 3 7.2 2.8 4.8 4.7 2.8 7 2.8z" />),
  chat: f(<path d="M12 2.6a9.4 9.4 0 0 0-8.1 14.1L2.8 21a.6.6 0 0 0 .8.7l4.4-1.2A9.4 9.4 0 1 0 12 2.6zm-3.4 5.2c.3 0 .6 0 .8.5l.8 1.9c.1.2 0 .5-.1.7l-.6.7c-.1.2-.2.4 0 .6.9 1.6 2.2 2.8 3.9 3.5.2.1.4 0 .6-.1l.8-.9c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.4.4.7 0 1.1-1 2.2-2.2 2.2-3.8 0-8.3-4.2-8.3-8.2 0-1.3 1-2.3 2.3-2.3z" />),
  clock: f(<path fillRule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm.9 4.4a.9.9 0 0 0-1.8 0V12c0 .3.1.6.4.8l3.2 2.2a.9.9 0 1 0 1-1.5l-2.8-1.9z" />),
  tag: f(<path fillRule="evenodd" d="M3 4.3C3 3.6 3.6 3 4.3 3h7.6c.4 0 .7.1 1 .4l8.3 8.3c.5.5.5 1.3 0 1.8l-7.5 7.5c-.5.5-1.3.5-1.8 0L3.4 12.7A1.4 1.4 0 0 1 3 11.8zm5.3 5.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />),
  locate: f(<path fillRule="evenodd" d="M12 1.8c.5 0 .9.4.9.9v1.7a7.7 7.7 0 0 1 6.7 6.7h1.7a.9.9 0 0 1 0 1.8h-1.7a7.7 7.7 0 0 1-6.7 6.7v1.7a.9.9 0 0 1-1.8 0v-1.7a7.7 7.7 0 0 1-6.7-6.7H2.7a.9.9 0 0 1 0-1.8h1.7a7.7 7.7 0 0 1 6.7-6.7V2.7c0-.5.4-.9.9-.9zm0 6.7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />),
};

export const I = {
  pin: s(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  locate: s(<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>),
  filter: s(<><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" fill="white" /><circle cx="15" cy="17" r="2" fill="white" /></>),
  search: s(<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>),
  globe: s(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></>),
  check: s(<path d="M5 12.5l4.2 4.2L19 7" />),
  phone: s(<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />),
  chat: s(<><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6z" /><path d="M9 9.5c.3 2.4 2.1 4.3 4.5 4.8l1-1.2 1.6.7" /></>),
  arrow: s(<path d="M5 12h14M13 6l6 6-6 6" />),
  arrowUp: s(<path d="M12 19V5M6 11l6-6 6 6" />),
  menu: s(<path d="M4 8h16M4 16h16" />),
  close: s(<path d="M6 6l12 12M18 6L6 18" />),
  clock: s(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  calendar: s(<><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h.01M12 14h.01M16 14h.01" /></>),
  tag: s(<><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0z" /><circle cx="8.2" cy="8.2" r="1.4" /></>),
  chevron: s(<path d="M6 9l6 6 6-6" />),
  scissors: s(<><circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8.1 7.6L20 18M8.1 16.4L20 6" /></>),
  star: s(<path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="currentColor" strokeWidth="1.2" />),
  camera: s(<><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10.5H4z" /><circle cx="12" cy="13.3" r="3.3" /></>),
  sparkle: s(<><path d="M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z" /><path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></>),
  smile: s(<><circle cx="12" cy="12" r="8.5" /><path d="M8.6 14.2c.9 1.3 2.1 2 3.4 2s2.5-.7 3.4-2" /><path d="M9.2 9.8h.01M14.8 9.8h.01" strokeWidth="2.4" /></>),
  crown: s(<><path d="M4.5 17.5L3.5 8l4.8 3.6L12 5.5l3.7 6.1L20.5 8l-1 9.5z" /><path d="M5 20.5h14" /></>),
  users: s(<><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19.5c.6-3.2 2.8-5.2 5.5-5.2s4.9 2 5.5 5.2" /><circle cx="17" cy="9.5" r="2.4" /><path d="M16.2 14.4c2.2.3 3.8 2 4.3 5" /></>),
  leaf: s(<><path d="M5 19.5C5 11 10 5.6 19.5 4.5 19.5 14 14.3 19.5 6 19.5z" /><path d="M5 19.5l7.5-7.5" /></>),
  sun: s(<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></>, 'sun'),
  moon: s(<path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z" />, 'moon'),
  pause: s(<path d="M9 5.5v13M15 5.5v13" />, 'pause'),
  play: s(<path d="M8 5.5v13l10-6.5z" />, 'play'),
};
