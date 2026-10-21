'use client';

import { useEffect, useRef } from 'react';
import animationData from '@/public/assets/animations/salon-scissors.json';

export default function SalonDiscoveryIcon() {
  const container = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let disposed = false;
    let animation: import('lottie-web').AnimationItem | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      if (!animation) return;
      if (motion.matches) animation.goToAndStop(0, true);
      else animation.play();
    };

    import('lottie-web').then(({ default: lottie }) => {
      if (disposed || !container.current) return;
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData,
      });
      animation.addEventListener('DOMLoaded', updateMotion);
      motion.addEventListener('change', updateMotion);
    });

    return () => {
      disposed = true;
      motion.removeEventListener('change', updateMotion);
      animation?.destroy();
    };
  }, []);

  return <span ref={container} className="salons__title-icon" aria-hidden="true" />;
}
