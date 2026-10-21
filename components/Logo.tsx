// Use the transparent supplied logo; keep the vector mark for small decorative uses.
import fs from 'node:fs';
import path from 'node:path';

const RAW = fs.readFileSync(path.join(process.cwd(), 'public/assets/img/trimcircle-horizontal.svg'), 'utf8');
const MARK_G = RAW.match(/<g [\s\S]*?<\/g>/)[0];

// Two files: green-and-terracotta for light pages, cream-and-terracotta for dark. CSS shows the one that fits the theme.
export function Logo({ className = 'logo', label }: { className?: string; label: string }) {
  return (
    <span className={`${className} logo-swap`}>
      <img className="logo-swap__light" src="/assets/img/trimcircle-logo-transparent.png" alt={label} />
      <img className="logo-swap__dark" src="/assets/img/trimcircle-logo-transparent-dark.png" alt="" aria-hidden="true" />
    </span>
  );
}

export function Mark({ className }: { className: string }) {
  return <svg className={className} viewBox="26 22 212 200" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: MARK_G }} />;
}
