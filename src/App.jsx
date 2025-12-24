import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, Terminal, 
  User, BookOpen, Briefcase, Monitor, 
  ArrowUpRight, Bot, Layers, Cpu, Server, Database
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * CONFIGURATION & PALETTE
 * ------------------------------------------------------------------
 */
const PALETTE = {
  blue: '#AEE2FF',      // Pastel Blue
  pink: '#FFB7D5',      // Soft Pink
  peach: '#FFD6A5',     // Peach
  lavender: '#E5C4FF',  // Lavender
};

const ACCENTS = {
  blue: 'text-sky-700 bg-sky-100',
  pink: 'text-pink-700 bg-pink-100',
  peach: 'text-orange-700 bg-orange-100',
  lavender: 'text-purple-700 bg-purple-100',
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

/**
 * ------------------------------------------------------------------
 * COMPONENTS
 * ------------------------------------------------------------------
 */

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const handleMouseOver = (e) => setIsHovering(!!e.target.closest('button, a, .interactive'));
    
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', scale: isHovering ? 2.5 : 1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] border border-white/40"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', scale: isHovering ? 1.2 : 1 }}
      />
    </>
  );
};

// Fixed SpotlightCard: Removed default bg-white/40 to prevent conflict with dark cards
const SpotlightCard = ({ children, className = "", delay = 0, onClick, spotlightColor = "rgba(255,255,255,0.25)" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group interactive ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
          opacity: opacity,
        }}
      />
      <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col">{children}</div>
    </motion.div>
  );
};

const MagneticButton = ({ children, href, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
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
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      className={`relative overflow-hidden interactive cursor-none ${className}`}
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
  // Expanded tech stack from resume
  const techStack = [
    'Java', 'J2EE', 'Spring', 'Hibernate', 'REST APIs', 
    'Python', 'React', 'TypeScript', 'MySQL', 'JDBC', 
    'Maven', 'Git', 'Tailwind', 'HTML/CSS', 'JSP'
  ];

  // Common styles for standard glass cards
  const glassCardStyles = "bg-white/40 backdrop-blur-xl border border-white/60";

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-purple-300 selection:text-purple-900 overflow-x-hidden">
      <CustomCursor />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-70 animate-pulse" style={{ backgroundColor: PALETTE.blue }} />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-60" style={{ backgroundColor: PALETTE.pink }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-60" style={{ backgroundColor: PALETTE.peach }} />
        <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-50" style={{ backgroundColor: PALETTE.lavender }} />
        <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />
      </div>

      <main className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl relative z-10">
        
        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/40 backdrop-blur border border-white/60 text-xs font-bold tracking-widest uppercase text-slate-500 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              Incubation Intern @ Zoho School for Graduate Studies
            </div>
            {/* FULL NAME */}
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-2">
              Kutraleeswaran <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500">B</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-light max-w-lg">
              Computer Science Engineer & Full-Stack Developer. <br />
              Specializing in scalable backend systems & modern UI.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <MagneticButton href="https://github.com/kutral" className="p-4 bg-white/80 rounded-full shadow-lg hover:shadow-xl text-slate-900 border border-white/50">
              <Github size={24} />
            </MagneticButton>
            <MagneticButton href="https://linkedin.com/in/kutraleeswaranb/" className="p-4 bg-blue-600/90 rounded-full shadow-lg hover:shadow-xl text-white">
              <Linkedin size={24} />
            </MagneticButton>
            <MagneticButton href="mailto:kutraleeswaran2003@gmail.com" className="p-4 bg-slate-900 rounded-full shadow-lg hover:shadow-xl text-white">
              <Mail size={24} />
            </MagneticButton>
          </motion.div>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 grid-auto-flow-dense">

          {/* 1. PROFILE (Top Left - Large) */}
          <SpotlightCard className={`md:col-span-4 min-h-[300px] ${glassCardStyles}`} delay={0.1}>
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 rounded-2xl ${ACCENTS.lavender} inline-block`}>
                  <User size={24} />
               </div>
               <span className="text-xs font-mono text-slate-400 tracking-wider">01 // ABOUT</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              Merging <span className="text-purple-600">System Design</span> with <span className="text-pink-600">Creative Logic</span>.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6 max-w-2xl">
              Computer Science & Engineering graduate currently at <strong>Zoho School for Graduate Studies</strong>. 
              I am passionate about Java programming, OOP principles, and building secure, scalable web applications.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-slate-100/80 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">🚀 Java Development</div>
              <div className="px-4 py-2 bg-slate-100/80 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">✨ Problem Solving</div>
            </div>
          </SpotlightCard>

          {/* 2. EXPERIENCE (Top Right - High Priority) */}
          <SpotlightCard className={`md:col-span-2 min-h-[300px] ${glassCardStyles}`} delay={0.15}>
            <div className={`p-3 rounded-2xl ${ACCENTS.blue} w-fit mb-4`}>
               <Briefcase size={22}/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Experience</h3>
            
            <div className="mt-4 space-y-4">
              <div className="relative pl-4 border-l-2 border-blue-200">
                 <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                 <h4 className="font-bold text-slate-800 leading-tight mb-1">Zoho School for Graduate Studies</h4>
                 <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Incubation Intern</p>
                 <p className="text-xs text-slate-400 font-mono mb-2">Sep 2025 - Present</p>
                 <p className="text-sm text-slate-600 leading-snug">
                   Intensive training in core Java, OOPs patterns, and debugging techniques. Working on real-world system design projects.
                 </p>
              </div>
            </div>
          </SpotlightCard>

          {/* 3. AI EXPERIMENTS (Middle Left - Distinctive) */}
          <SpotlightCard 
            className="md:col-span-2 md:row-span-2 bg-slate-900 text-white border border-slate-800 shadow-2xl" 
            spotlightColor="rgba(255, 255, 255, 0.08)"
            delay={0.2}
          >
            <div className="flex items-center gap-2 mb-6">
              <Bot size={20} className="text-pink-400 animate-pulse" />
              <h3 className="text-lg font-bold tracking-wide text-slate-100">AI & Web Labs</h3>
            </div>
            
            <div className="space-y-3">
              {AI_PROJECTS.map((proj, i) => (
                <a 
                  key={i} 
                  href={proj.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block group/item bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all hover:translate-x-1"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 font-bold text-slate-200 group-hover/item:text-pink-300 transition-colors text-sm">
                      {proj.title}
                    </div>
                    <ExternalLink size={12} className="opacity-50 group-hover/item:opacity-100 text-white" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">{proj.desc}</p>
                </a>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
               <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Featured Experiments</span>
            </div>
          </SpotlightCard>

          {/* 4. MAJOR PROJECTS (Middle Right - Wide) */}
          <SpotlightCard className={`md:col-span-4 min-h-[260px] ${glassCardStyles}`} delay={0.25}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-xl ${ACCENTS.lavender}`}><Terminal size={20}/></div>
                 <h3 className="text-2xl font-bold text-slate-900">Engineering Projects</h3>
               </div>
               <span className="text-xs font-mono text-slate-400">02 // DEV</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project A */}
              <a href="https://github.com/Kutral/LibraryProjectFrontend" target="_blank" rel="noreferrer" className="group block p-4 rounded-2xl bg-white/40 border border-slate-200/60 hover:border-purple-300 hover:bg-white transition-all">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Knowledge Nexus</h4>
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                 </div>
                 <p className="text-sm text-slate-600 mb-3">Library Management System. Secure login, REST API architecture, and strict JSON communication.</p>
                 <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded">Java Servlets</span>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded">JSP</span>
                 </div>
              </a>

              {/* Project B */}
              <div className="p-4 rounded-2xl bg-white/40 border border-slate-200/60 cursor-default">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-slate-900">ATM & Bus Booking</h4>
                    <Code2 size={16} className="text-slate-400" />
                 </div>
                 <p className="text-sm text-slate-600 mb-3">Pure Java console applications implementing MVC & MVP patterns to demonstrate core OOP logic.</p>
                 <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">OOP</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">Java</span>
                 </div>
              </div>
            </div>
          </SpotlightCard>

          {/* 5. EDUCATION (Bottom Left) */}
          <SpotlightCard className={`md:col-span-2 min-h-[180px] ${glassCardStyles}`} delay={0.3}>
             <div className={`p-2 rounded-xl ${ACCENTS.peach} w-fit mb-4`}>
                <BookOpen size={20}/>
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">Education</h3>
             <div className="mt-2">
               <h4 className="font-bold text-slate-800 text-sm">Vel Tech Rangarajan</h4>
               <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">B.Tech CSE • 2020-2024</p>
               <div className="flex items-center gap-2 mt-3">
                 <span className="text-2xl font-black text-slate-900">8.18</span>
                 <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">CGPA</span>
               </div>
             </div>
          </SpotlightCard>

          {/* 6. SKILLS (Bottom Right) */}
          <SpotlightCard className="md:col-span-2 bg-gradient-to-br from-white/60 to-white/20 border border-white/60 backdrop-blur-xl" delay={0.35}>
             <div className="flex items-center gap-2 mb-4">
                <Cpu size={18} className="text-slate-400"/>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Tech Stack</h3>
             </div>
             <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-white border border-white/50 shadow-sm rounded-lg text-xs font-semibold text-slate-700 hover:scale-105 transition-transform cursor-default">
                    {tech}
                  </span>
                ))}
             </div>
          </SpotlightCard>

        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 flex justify-between items-center text-slate-400 text-sm font-medium">
          <p>© {new Date().getFullYear()} Kutraleeswaran B.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Available for opportunities</span>
          </div>
        </footer>

      </main>
    </div>
  );
}