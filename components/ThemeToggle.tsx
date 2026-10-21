import { I } from './icons';

// Switches between the light and dark theme. The label names the theme a click switches to;
// the home page's SiteEffects (or the salon page's inline script) wires the click.
export function ThemeToggle({ className, toDark, toLight }: { className: string; toDark: string; toLight: string }) {
  return (
    <button type="button" className={`theme-toggle ${className}`} data-theme-toggle="" aria-label={toDark} data-label-dark={toDark} data-label-light={toLight}>
      {I.moon}{I.sun}
    </button>
  );
}

// Standalone wiring for pages without SiteEffects.
export const themeToggleScript = `(function(d){var h=d.documentElement;
function set(t){h.setAttribute('data-theme',t);h.style.colorScheme=t;var m=d.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#0A0A0A':'#FDFDFB';
d.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.setAttribute('aria-label',t==='dark'?b.dataset.labelLight:b.dataset.labelDark)})}
set(h.getAttribute('data-theme')==='dark'?'dark':'light');
d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-theme-toggle]');if(!b)return;
var t=h.getAttribute('data-theme')==='dark'?'light':'dark';try{localStorage.setItem('tc-theme',t)}catch(x){}set(t)});})(document);`;
