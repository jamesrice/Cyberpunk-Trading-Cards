/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';

const CHARS = '░▒▓█_\\/|()[]{}<>*+=-. ';

const GlitchBackground = React.memo(() => {
    const [glitchText, setGlitchText] = useState('');
    const dimensions = useRef({ width: 0, height: 0 });
    const time = useRef(0);
    const animationFrameId = useRef<number | null>(null);
    const lastFrameTime = useRef(0);
    const frameInterval = 1000 / 15; // 15 FPS

    const generateGlitchText = () => {
        const { width, height } = dimensions.current;
        if (width === 0 || height === 0) return '';
        
        time.current += 0.03;

        let text = '';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - width / 2;
                const dy = y - height / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const wave1 = Math.sin(x * 0.15 + time.current);
                const wave2 = Math.sin(y * 0.1 + time.current);
                const wave3 = Math.sin(dist * 0.08 + time.current);

                const combined = (wave1 + wave2 + wave3 + 3) / 6; // Normalize to 0-1
                const charIndex = Math.floor(combined * CHARS.length);
                text += CHARS[charIndex] || ' ';
            }
            text += '\n';
        }
        return text;
    };

    useEffect(() => {
        const updateDimensions = () => {
            // Approximate char dimensions. This doesn't need to be perfect.
            const charWidth = 9.6; // font-roboto-mono text-base
            const charHeight = 20; // line-height-tight (1.25 * 16px)
            dimensions.current = {
                // Add a larger buffer to ensure full coverage, as calculations can be off
                // due to font rendering, scrollbars, etc. Excess is hidden by overflow:hidden.
                width: Math.ceil(window.innerWidth / charWidth) + 10,
                height: Math.ceil(window.innerHeight / charHeight) + 5,
            };
            // Initial generation
            setGlitchText(generateGlitchText());
        };

        const animate = (currentTime: number) => {
            if (currentTime - lastFrameTime.current > frameInterval) {
                setGlitchText(generateGlitchText());
                lastFrameTime.current = currentTime;
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <pre
            aria-hidden="true"
            className="fixed top-0 left-0 w-screen h-screen text-[#222] bg-black font-roboto-mono text-base leading-tight overflow-hidden pointer-events-none"
        >
            {glitchText}
        </pre>
    );
});

export default GlitchBackground;