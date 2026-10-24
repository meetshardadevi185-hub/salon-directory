'use client';
// Small interactive pieces of the salon profile page: the photo gallery and the weekly hours (today highlighted).
import { useEffect, useState } from 'react';

export function ProfileGallery({ images, label }: { images: { src: string; alt: string }[]; label: string }) {
  const [i, setI] = useState(0);
  const cur = images[i];
  return (
    <div className="pf-gallery" aria-label={label}>
      <div className="pf-gallery__main">
        <img key={cur.src} src={cur.src} alt={cur.alt} fetchPriority={i === 0 ? 'high' : 'auto'} decoding="async" />
        <span className="pf-gallery__count">{i + 1} / {images.length}</span>
      </div>
      <ul className="pf-gallery__thumbs" role="list">
        {images.map((im, n) => (
          <li key={im.src}>
            <button type="button" className={n === i ? 'is-on' : ''} aria-label={`${label} ${n + 1}`} aria-pressed={n === i} onClick={() => setI(n)}>
              <img src={im.src} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function WeekHours({ rows, todayLabel }: { rows: { key: string; day: string; hours: string }[]; todayLabel: string }) {
  const [today, setToday] = useState('');
  useEffect(() => { setToday(KEYS[new Date().getDay()]); }, []);
  return (
    <ul className="pf-hours" role="list">
      {rows.map(r => (
        <li key={r.key} className={r.key === today ? 'is-today' : undefined}>
          <span>{r.day}{r.key === today && <em>{todayLabel}</em>}</span>
          <b>{r.hours}</b>
        </li>
      ))}
    </ul>
  );
}
