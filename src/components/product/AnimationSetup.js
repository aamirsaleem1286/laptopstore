'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimation, useReducedMotion } from 'framer-motion';

export default function AnimationSetup({ children }) {
  return (
    <AnimatePresence mode='wait' initial={false} exitBeforeEnter={true} onExitComplete={() => window.scrollTo(0, 0)}>
      {children}
    </AnimatePresence>
  );
}

export { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimation };

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};

export const fadeInStagger = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

export const slideUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { y: -30, opacity: 0, transition: { duration: 0.2 } },
};

export const cardHover = {
  hover: { y: -8, scale: 1.02, shadow: '0 20px 40px rgba(0,0,0,0.15)' },
  tap: { scale: 0.98, y: -4 },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};

export const imageZoom = {
  hover: { scale: 1.1, filter: 'brightness(1.05) contrast(1.05)' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const lazyLoad = (threshold = 0.1) => (
  Component
) => {
  const ref = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className='lazy-load-wrapper'>
      {Component}
    </div>
  );
};

export const scrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.8]);

  return {
    style: { scale, opacity, transformOrigin: 'top center' },
    viewport: { once: true, margin: '-100px', amount: 0.3 },
  };
};

export const cardEntrance = (index = 0) => ({
  initial: { y: 100, opacity: 0, rotateX: 15 },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      delay: index * 0.05,
      type: 'spring',
      stiffness: 180,
      damping: 30,
      duration: 0.8,
    },
  },
  whileTap: { scale: 0.95, y: 5, rotateX: 5 },
});

export const morphTransition = {
  initial: { opacity: 0, clipPath: 'inset(0 50% 0 0)' },
  animate: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
  exit: { opacity: 0, clipPath: 'inset(0 0 0 50%)' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
};

export const skeletonLoading = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

export const glassEffect = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

export const magneticHover = (element) => {
  const motionValueX = useMotionValue(0);
  const motionValueY = useMotionValue(0);

  const handleMouseMove = (event) => {
    const rect = element.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const distanceX = (mouseX - centerX) / (rect.width / 2);
    const distanceY = (mouseY - centerY) / (rect.height / 2);

    motionValueX.set(distanceX * 10);
    motionValueY.set(distanceY * 10);
  };

  const handleMouseLeave = () => {
    motionValueX.set(0);
    motionValueY.set(0);
  };

  useEffect(() => {
    const current = element.current;
    if (!current) return;

    current.addEventListener('mousemove', handleMouseMove);
    current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      current.removeEventListener('mousemove', handleMouseMove);
      current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [element]);

  return {
    x: motionValueX,
    y: motionValueY,
  };
};

export const parallaxScroll = (speed = 0.5) => {
  const { scrollY } = useMotionValue(window);
  const y = useTransform(scrollY, [0, 1000], [0, speed * 100]);

  return {
    style: { y, transformStyle: 'preserve-3d' },
  };
};

export const blurOnScroll = (threshold = 0) => {
  const { scrollYProgress } = useScroll();
  const blur = useTransform(scrollYProgress, [0, threshold, 1], [0, 5, 20]);
  const opacity = useTransform(scrollYProgress, [0, threshold, 1], [1, 0.7, 0.3]);

  return {
    style: {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      opacity,
    },
  };
};

export const cpuIntensiveAnimation = (enabled = true) => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion && enabled;
  }
  return true;
};

export const animationConfig = {
  fadeIn,
  fadeInStagger,
  slideUp,
  cardHover,
  imageZoom,
  cardEntrance,
  morphTransition,
  skeletonLoading,
  glassEffect,
  magneticHover,
  parallaxScroll,
  blurOnScroll,
  cpuIntensiveAnimation,
  lazyLoad,
  scrollAnimation,
};

export { AnimatePresence };