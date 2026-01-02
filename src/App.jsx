import React, { useState, useEffect, useRef, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import Lenis from 'lenis';
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import {
  Github, Linkedin, Mail, ExternalLink, Code2, Terminal,
  User, BookOpen, Briefcase, Monitor,
  ArrowUpRight, Bot, Layers, Cpu, Share2, Home, FolderKanban, GraduationCap,
  ChevronLeft, ChevronRight, Sun, Moon,
  Coffee, Database, GitBranch, Globe, Server, Box, Wrench, FileCode, Layout, Book, CreditCard
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * CONFIGURATION & PALETTE
 * ------------------------------------------------------------------
 */
const PALETTE = {
  blue: '#AEE2FF',
  pink: '#FFB7D5',
  peach: '#FFD6A5',
  lavender: '#E5C4FF',
};

const DARK_PALETTE = {
  blue: '#1e3a5f',
  pink: '#5f1e3a',
  peach: '#5f4a1e',
  lavender: '#3a1e5f',
};

const ACCENTS = {
  blue: 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-900/50',
  pink: 'text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-900/50',
  peach: 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50',
  lavender: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/50',
};

const AI_PROJECTS = [
  {
    title: "Todo App",
    desc: "TypeScript task manager with complex state logic.",
    link: "https://kutral.github.io/todo/",
    icon: <Layers size={18} />,
    tags: ["TypeScript", "State"]
  },
  {
    title: "3D Desktop",
    desc: "WebGL & GLSL based desktop environment simulation.",
    link: "https://kutral.github.io/3d/",
    icon: <Monitor size={18} />,
    tags: ["WebGL", "Creative"]
  },
  {
    title: "Portfolio V1",
    desc: "React Three Fiber visualization showcase.",
    link: "https://kutral.github.io/Portfolio/",
    icon: <User size={18} />,
    tags: ["R3F", "3D"]
  }
];

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E`;

// Card IDs for keyboard navigation
const CARD_IDS = ['about', 'experience', 'ai-labs', 'projects', 'education', 'skills'];

/**
 * ------------------------------------------------------------------
 * HOOKS
 * ------------------------------------------------------------------
 */

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(hasTouchScreen || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Default to light mode (false) if no preference saved
      return false;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return [isDark, setIsDark];
};

const triggerHaptic = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
    };
    navigator.vibrate(patterns[type] || patterns.light);
  }
};

/**
 * ------------------------------------------------------------------
 * COMPONENTS
 * ------------------------------------------------------------------
 */

// Scroll Progress Indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Theme Toggle
const ThemeToggle = ({ isDark, setIsDark, isMobile }) => {
  return (
    <motion.button
      data-cursor-text="THEME"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        isMobile && triggerHaptic('light');

        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
          setIsDark(!isDark);
          return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
          setIsDark(!isDark);
        });

        transition.ready.then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 500,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        });
      }}
      className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/50 dark:border-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={20} className="text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={20} className="text-slate-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// CustomCursor is now imported from components/CustomCursor.jsx


// Pull to Refresh
const PullToRefresh = ({ onRefresh }) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling || window.scrollY > 0) return;
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, Math.min((currentY - startY.current) * 0.5, 120));
      setPullDistance(distance);
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold) {
        triggerHaptic('success');
        onRefresh?.();
      }
      setPulling(false);
      setPullDistance(0);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, pullDistance, onRefresh]);

  return (
    <AnimatePresence>
      {pullDistance > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4"
          style={{ transform: `translateY(${pullDistance - 40}px)` }}
        >
          <motion.div
            animate={{ rotate: pullDistance >= threshold ? 180 : 0 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${pullDistance >= threshold ? 'bg-green-500' : 'bg-white/80 dark:bg-slate-800/80'
              } shadow-lg backdrop-blur-sm`}
          >
            <motion.div
              animate={{ rotate: pulling ? 360 : 0 }}
              transition={{ duration: 1, repeat: pulling && pullDistance >= threshold ? Infinity : 0 }}
              className="w-5 h-5 border-2 border-slate-600 dark:border-slate-300 border-t-transparent rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Sticky Header
const StickyHeader = ({ isVisible, isMobile, isDark, setIsDark }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/60 dark:border-slate-800 shadow-sm"
        >
          <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Kutraleeswaran B</span>
            </div>
            <div className="flex gap-2">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} isMobile={isMobile} />
              <a href="https://github.com/kutral" target="_blank" rel="noreferrer"
                data-cursor-text="CODE"
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => isMobile && triggerHaptic('light')}>
                <Github size={18} className="dark:text-white" />
              </a>
              <a href="https://linkedin.com/in/kutraleeswaranb/" target="_blank" rel="noreferrer"
                data-cursor-text="LINK"
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-blue-600 dark:text-blue-400"
                onClick={() => isMobile && triggerHaptic('light')}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

// Back to Top Button
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-md md:bottom-8 md:right-8"
        >
          <ArrowUpRight size={20} className="text-slate-900 dark:text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Bottom Navigation (Mobile)
const BottomNavigation = ({ isMobile }) => {
  if (!isMobile) return null;

  const scrollToSection = (id) => {
    triggerHaptic('light');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    triggerHaptic('medium');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kutraleeswaran B - Portfolio',
          text: 'Check out this portfolio!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
    >
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-2 flex justify-around items-center">
        <button onClick={() => scrollToSection('about')}
          className="flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] rounded-xl hover:bg-white/10 transition-colors">
          <Home size={20} className="text-white" />
          <span className="text-[10px] text-white/70">About</span>
        </button>
        <button onClick={() => scrollToSection('projects')}
          className="flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] rounded-xl hover:bg-white/10 transition-colors">
          <FolderKanban size={20} className="text-white" />
          <span className="text-[10px] text-white/70">Projects</span>
        </button>
        <button onClick={() => scrollToSection('education')}
          className="flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] rounded-xl hover:bg-white/10 transition-colors">
          <GraduationCap size={20} className="text-white" />
          <span className="text-[10px] text-white/70">Education</span>
        </button>
        <button onClick={handleShare}
          className="flex flex-col items-center gap-1 p-3 min-w-[56px] min-h-[56px] rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors">
          <Share2 size={20} className="text-white" />
          <span className="text-[10px] text-white/90">Share</span>
        </button>
      </div>
    </motion.nav>
  );
};

// Swipeable Projects (Mobile)
const SwipeableProjects = ({ projects, isMobile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      triggerHaptic('light');
      if (diff > 0 && currentIndex < projects.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
    setIsDragging(false);
  };

  if (!isMobile) {
    return (
      <div className="space-y-3">
        {projects.map((proj, i) => (
          <a
            key={i}
            href={proj.link}
            target="_blank"
            rel="noreferrer"
            className="block group/item bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 p-3 rounded-xl border border-slate-200 dark:border-white/10 transition-all hover:translate-x-1"
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 group-hover/item:text-pink-500 dark:group-hover/item:text-pink-300 transition-colors text-sm">
                {proj.title}
              </div>
              <ExternalLink size={12} className="opacity-50 group-hover/item:opacity-100 text-slate-400 dark:text-white" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{proj.desc}</p>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="overflow-hidden"
      >
        <motion.div
          animate={{ x: -currentIndex * 100 + '%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="flex"
        >
          {projects.map((proj, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="block bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 min-h-[120px]"
                onClick={() => triggerHaptic('light')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-base">{proj.title}</div>
                  <ExternalLink size={14} className="text-slate-400 dark:text-white/50" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{proj.desc}</p>
                <div className="flex gap-2 mt-3">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white dark:bg-white/10 text-slate-600 dark:text-white/70 px-2 py-1 rounded border border-slate-200 dark:border-none">{tag}</span>
                  ))}
                </div>
              </a>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIndex(i); triggerHaptic('light'); }}
            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-pink-500 dark:bg-pink-400 w-4' : 'bg-slate-300 dark:bg-white/30'
              }`}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-1 mt-2 text-slate-400 dark:text-white/30 text-xs">
        <ChevronLeft size={12} />
        <span>Swipe</span>
        <ChevronRight size={12} />
      </div>
    </div>
  );
};

// Optimized Parallax Background with CSS-only transforms
const ParallaxBackground = React.memo(({ isDark }) => {
  const [scrollY, setScrollY] = useState(0);
  const palette = isDark ? DARK_PALETTE : PALETTE;
  const rafId = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={`fixed inset-0 w-full h-full -z-10 transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] rounded-full blur-[80px] sm:blur-[120px] opacity-70 will-change-transform"
        style={{
          backgroundColor: palette.blue,
          transform: `translate3d(0, ${scrollY * -0.15}px, 0)`,
          transition: 'background-color 0.5s'
        }}
      />
      <div
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[60px] sm:blur-[100px] opacity-60 will-change-transform"
        style={{
          backgroundColor: palette.pink,
          transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
          transition: 'background-color 0.5s'
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[10%] sm:left-[20%] w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] rounded-full blur-[80px] sm:blur-[120px] opacity-60 will-change-transform"
        style={{
          backgroundColor: palette.peach,
          transform: `translate3d(0, ${scrollY * -0.2}px, 0)`,
          transition: 'background-color 0.5s'
        }}
      />
      <div
        className="absolute bottom-[20%] right-[20%] sm:right-[30%] w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[60px] sm:blur-[100px] opacity-50 will-change-transform"
        style={{
          backgroundColor: palette.lavender,
          transform: `translate3d(0, ${scrollY * -0.08}px, 0)`,
          transition: 'background-color 0.5s'
        }}
      />
      <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />
    </div>
  );
});


// Spotlight Card with 3D Tilt & Glare
const SpotlightCard = ({ children, className = "", delay = 0, onClick, spotlightColor = "rgba(255,255,255,0.25)", id, isFocused }) => {
  const divRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e) => {
    if (!divRef.current || isMobile) return;
    const rect = divRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalized coordinates -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={id}
      ref={divRef}
      tabIndex={0}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: isFocused ? '0 0 0 3px rgba(147, 51, 234, 0.5)' : 'none',
      }}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { if (!isMobile) setIsHovered(true); }}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 group interactive outline-none transform perspective-1000 ${className}`}
    >
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${useTransform(x, [-0.5, 0.5], ['0%', '100%'])} ${useTransform(y, [-0.5, 0.5], ['0%', '100%'])}, ${spotlightColor}, transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col transform-gpu preserve-3d">{children}</div>
    </motion.div>
  );
};

const MagneticButton = ({ children, href, className = "", isMobile, cursorText }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPosition({ x: (clientX - (left + width / 2)) * 0.2, y: (clientY - (top + height / 2)) * 0.2 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor-text={cursorText}
      animate={isMobile ? {} : position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      onClick={() => isMobile && triggerHaptic('light')}
      className={`relative overflow-hidden interactive min-w-[44px] min-h-[44px] flex items-center justify-center ${isMobile ? '' : 'cursor-none'} ${className}`}
    >
      {children}
    </motion.a>
  );
};

/**
 * ------------------------------------------------------------------
 * MAIN APP
 * ------------------------------------------------------------------
 */
export default function App() {
  const isMobile = useIsMobile();
  const [isDark, setIsDark] = useTheme();
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState(-1);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scrolling (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev < CARD_IDS.length - 1 ? prev + 1 : 0;
          document.getElementById(CARD_IDS[next])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById(CARD_IDS[next])?.focus();
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev > 0 ? prev - 1 : CARD_IDS.length - 1;
          document.getElementById(CARD_IDS[next])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById(CARD_IDS[next])?.focus();
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const TECH_CATEGORIES = [
    {
      title: 'Front-End Development',
      skills: [
        { name: 'HTML', icon: <Layout size={14} />, color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' },
        { name: 'CSS', icon: <Box size={14} />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
        { name: 'JavaScript', icon: <Code2 size={14} />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300' },
        { name: 'JSP', icon: <FileCode size={14} />, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' }
      ]
    },
    {
      title: 'Back-End Development',
      skills: [
        { name: 'Java', icon: <Coffee size={14} />, color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
        { name: 'Servlets', icon: <Server size={14} />, color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' },
        { name: 'REST APIs', icon: <Globe size={14} />, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' }
      ]
    },
    {
      title: 'Database & Tools',
      skills: [
        { name: 'MySQL', icon: <Database size={14} />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-200' },
        { name: 'JDBC', icon: <Database size={14} />, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300' },
        { name: 'Maven', icon: <Wrench size={14} />, color: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300' }
      ]
    }
  ];

  const glassCardStyles = "bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-md";

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-300 selection:text-purple-900 overflow-x-hidden transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Custom Cursor (Desktop only) */}
      {!isMobile && <CustomCursor />}

      {/* Pull to Refresh (Mobile only) */}
      {isMobile && <PullToRefresh onRefresh={handleRefresh} />}

      {/* Parallax Background */}
      <ParallaxBackground isDark={isDark} />

      {/* Sticky Header */}
      <StickyHeader isVisible={showStickyHeader} isMobile={isMobile} isDark={isDark} setIsDark={setIsDark} />

      {/* Bottom Navigation (Mobile) */}
      <BottomNavigation isMobile={isMobile} />

      {/* Back To Top */}
      <BackToTop />

      <main className={`container mx-auto px-4 py-12 sm:py-20 max-w-7xl relative z-10 ${isMobile ? 'pb-28' : ''}`}>

        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-white/60 dark:border-slate-700 text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              Incubation Intern @ Zoho School for Graduate Studies
            </div>
            <h1 className={`text-4xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kutraleeswaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-500 to-violet-700 bg-[length:200%_auto] animate-gradient">B</span>
            </h1>
            <p className={`text-base sm:text-xl font-light max-w-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Computer Science Engineer & Full-Stack Developer. <br />
              Specializing in scalable backend systems & modern UI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 flex-wrap"
          >
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} isMobile={isMobile} />
            <MagneticButton isMobile={isMobile} href="https://github.com/kutral" cursorText="CODE" className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:shadow-xl text-slate-900 dark:text-white border border-white/50 dark:border-slate-700">
              <Github size={24} />
            </MagneticButton>
            <MagneticButton isMobile={isMobile} href="https://linkedin.com/in/kutraleeswaranb/" cursorText="CONNECT" className="p-4 bg-blue-600/90 rounded-full shadow-lg hover:shadow-xl text-white">
              <Linkedin size={24} />
            </MagneticButton>
            <MagneticButton isMobile={isMobile} href="mailto:kutraleeswaran2003@gmail.com" cursorText="MAIL" className="p-4 bg-slate-900 dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl text-white">
              <Mail size={24} />
            </MagneticButton>
          </motion.div>
        </header>

        {/* Keyboard Navigation Hint (Desktop) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-6 text-center"
          >
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              💡 Use arrow keys to navigate between cards
            </span>
          </motion.div>
        )}

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-6 grid-auto-flow-dense">

          {/* 1. PROFILE */}
          <SpotlightCard id="about" isFocused={focusedCardIndex === 0} className={`md:col-span-4 min-h-[280px] sm:min-h-[300px] scroll-mt-28 ${glassCardStyles}`} delay={0.1}>
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className={`p-3 rounded-2xl ${ACCENTS.lavender} inline-block`}>
                <User size={24} />
              </div>
              <span className={`text-xs font-mono tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>01 // ABOUT</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Merging <span className="text-purple-600 dark:text-purple-400">System Design</span> with <span className="text-pink-600 dark:text-pink-400">Creative Logic</span>.
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed mb-6 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Computer Science & Engineering graduate currently at <strong className={isDark ? 'text-white' : 'text-slate-900'}>Zoho School for Graduate Studies</strong>.
              I am passionate about Java programming, OOP principles, and building secure, scalable web applications.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${isDark ? 'bg-slate-700/80 text-slate-200 border-slate-600/50' : 'bg-slate-50/80 text-slate-700 border-slate-200 shadow-sm'}`}>🚀 Java Development</div>
              <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${isDark ? 'bg-slate-700/80 text-slate-200 border-slate-600/50' : 'bg-slate-50/80 text-slate-700 border-slate-200 shadow-sm'}`}>✨ Problem Solving</div>
            </div>
          </SpotlightCard>

          {/* 2. EXPERIENCE */}
          <SpotlightCard id="experience" isFocused={focusedCardIndex === 1} className={`md:col-span-2 min-h-[280px] sm:min-h-[300px] scroll-mt-28 ${glassCardStyles}`} delay={0.15}>
            <div className={`p-3 rounded-2xl ${ACCENTS.blue} w-fit mb-4`}>
              <Briefcase size={22} />
            </div>
            <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Experience</h3>

            <div className="mt-6 ml-2">
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 space-y-8 ml-2 pb-2">

                {/* Timeline Item 1 */}
                <div className="relative pl-6">
                  <span className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 ${isDark ? 'border-slate-900 bg-blue-500' : 'border-white bg-blue-600'}`} />
                  <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Zoho School for Graduate Studies</h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-2">Incubation Intern • Sep 2025 - Present</p>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Intensive training in core Java, OOPs patterns, and debugging techniques. Working on real-world system design projects to build scalable solutions.
                  </p>
                </div>

                {/* Timeline Item 2 (Placeholder for future) */}
                {/* <div className="relative pl-6 opacity-50"> ... </div> */}

              </div>
            </div>
          </SpotlightCard>

          {/* 3. AI EXPERIMENTS */}
          <SpotlightCard
            id="ai-labs"
            isFocused={focusedCardIndex === 2}
            className="md:col-span-2 md:row-span-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl order-last md:order-none"
            spotlightColor={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}
            delay={0.2}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot size={20} className="text-pink-500 dark:text-pink-400 animate-pulse" />
              <h3 className="text-lg font-bold tracking-wide text-slate-800 dark:text-slate-100">AI & Web Labs</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 italic">Built just for fun using AI tools ✨</p>

            <SwipeableProjects projects={AI_PROJECTS} isMobile={isMobile} />

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">Featured Experiments</span>
            </div>
          </SpotlightCard>

          {/* 4. MAJOR PROJECTS */}
          <SpotlightCard id="projects" isFocused={focusedCardIndex === 3} className={`md:col-span-4 min-h-[240px] sm:min-h-[260px] scroll-mt-28 ${glassCardStyles}`} delay={0.25}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${ACCENTS.lavender}`}><Terminal size={20} /></div>
                <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Engineering Projects</h3>
              </div>
              <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>02 // DEV</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://github.com/Kutral/LibraryProjectFrontend" target="_blank" rel="noreferrer"
                data-cursor-text="OPEN"
                className={`group block p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-700/40 border-slate-600/60 hover:border-purple-500 hover:bg-slate-700' : 'bg-white/40 border-slate-200/60 hover:border-purple-300 hover:bg-white'}`}
                onClick={() => isMobile && triggerHaptic('light')}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                      <Book size={16} />
                    </div>
                    <h4 className={`font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Knowledge Nexus</h4>
                  </div>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Library Management System. Secure login, REST API architecture, and strict JSON communication.</p>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDark ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>Java Servlets</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDark ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>JSP</span>
                </div>
              </a>

              <div className={`p-4 rounded-2xl border cursor-default ${isDark ? 'bg-slate-700/40 border-slate-600/60' : 'bg-white/40 border-slate-200/60'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                      <CreditCard size={16} />
                    </div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>ATM & Bus Booking</h4>
                  </div>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pure Java console applications implementing MVC & MVP patterns to demonstrate core OOP logic.</p>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>OOP</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>Java</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* 5. EDUCATION */}
          <SpotlightCard id="education" isFocused={focusedCardIndex === 4} className={`md:col-span-2 min-h-[180px] scroll-mt-28 ${glassCardStyles}`} delay={0.3}>
            <div className={`p-2 rounded-xl ${ACCENTS.peach} w-fit mb-4`}>
              <BookOpen size={20} />
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Education</h3>
            <div className="mt-2">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Vel Tech Rangarajan</h4>
              <p className={`text-xs uppercase tracking-wide font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>B.Tech CSE • 2020-2024</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>8.18</span>
                <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded uppercase">CGPA</span>
              </div>
            </div>
          </SpotlightCard>

          {/* 6. SKILLS */}
          <SpotlightCard id="skills" isFocused={focusedCardIndex === 5} className={`md:col-span-2 bg-gradient-to-br ${isDark ? 'from-slate-800/60 to-slate-900/20' : 'from-white/60 to-white/20'} border ${isDark ? 'border-slate-700/60' : 'border-white/60'} backdrop-blur-xl`} delay={0.35}>
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
              <h3 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tech Stack</h3>
            </div>
            <div className="flex flex-col gap-5">
              {TECH_CATEGORIES.map((category, idx) => (
                <div key={idx}>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 border-b pb-1 ${isDark ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-200'}`}>
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((tech) => (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent transition-all cursor-default ${tech.color} bg-opacity-20 dark:bg-opacity-10`}
                      >
                        <div className="opacity-80">{tech.icon}</div>
                        <span className="font-bold text-[11px]">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

        </div>

        <footer className={`mt-20 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          <p>© {new Date().getFullYear()} Kutraleeswaran B.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Available for opportunities</span>
          </div>
        </footer>

      </main >
    </div >
  );
}