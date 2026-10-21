'use client';
import { useEffect } from 'react';
import { initSite, type Runtime } from '@/lib/site-effects';

// Wires up search, filters, menus and GSAP motion on the server-rendered page once it has hydrated.
export default function SiteEffects({ runtime }: { runtime: Runtime }) {
  useEffect(() => { initSite(runtime); }, [runtime]);
  return null;
}
