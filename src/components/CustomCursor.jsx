
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState("");
    const [cursorScale, setCursorScale] = useState(1);

    // Initialize off-screen to prevent flash
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring animation - Tuned for snappier feel (less lag)
    const springConfig = { damping: 35, stiffness: 800, mass: 0.1 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const updateMousePosition = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target;

            // OPTIMIZED: Single closest call with comma-separated selectors for better performance
            const clickable = target.closest('button, a, [data-hover="true"], .clickable, .interactive, input, textarea');

            setIsHovering(!!clickable);

            if (clickable) {
                // 1. Check for explicit data-cursor-text
                const customText = clickable.getAttribute('data-cursor-text');
                if (customText) {
                    setCursorText(customText);
                    return;
                }

                // 2. Intelligent Fallbacks based on element type/attributes
                const tagName = clickable.tagName.toLowerCase();

                if (tagName === 'input' || tagName === 'textarea') {
                    setCursorText("TYPE");
                } else if (tagName === 'a') {
                    const href = clickable.getAttribute('href');
                    const targetAttr = clickable.getAttribute('target');

                    if (href && href.startsWith('mailto:')) {
                        setCursorText("MAIL");
                    } else if (href && href.startsWith('tel:')) {
                        setCursorText("CALL");
                    } else if (targetAttr === '_blank') {
                        setCursorText("OPEN");
                    } else {
                        setCursorText("VISIT");
                    }
                } else if (tagName === 'button') {
                    setCursorText(""); // Always empty for buttons unless data-cursor-text is present
                } else {
                    // Default for other interactive elements
                    setCursorText("");
                }
            } else {
                setCursorText("");
            }

            // Determine Scale
            if (clickable) {
                // Determine if it is a text input
                const tagName = clickable.tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea') {
                    setCursorScale(0.8); // Smaller for typing
                } else {
                    setCursorScale(1.5); // Large for other interactions
                }
            } else {
                // Check if hovering over body text elements (exclude headers) using single optimized selector
                const isBodyText = target.closest('p, span, li, code, strong, em, b, i, small, label, td, th, blockquote');

                if (isBodyText) {
                    setCursorScale(0.4); // Very small for reading body text
                } else {
                    setCursorScale(1); // Default (includes headers h1-h6)
                }
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center hidden md:flex will-change-transform"
            style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        >
            <motion.div
                className="relative rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center"
                style={{ width: 80, height: 80 }}
                animate={{
                    scale: cursorScale,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                <motion.span
                    className="z-10 text-black font-black uppercase tracking-widest text-xs overflow-hidden whitespace-nowrap px-2"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isHovering ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {cursorText}
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default CustomCursor;
