/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { DraggableCardContainer, DraggableCardBody } from './ui/draggable-card';
import { cn } from '../lib/utils';
import { PanInfo, motion } from 'framer-motion';
import type { CardData } from '../services/geminiService';
import { toJpeg } from 'html-to-image';

type ImageStatus = 'pending' | 'done' | 'error';

interface CyberCardProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    cardData?: CardData;
    dragConstraintsRef?: React.RefObject<HTMLElement>;
    onShake?: (caption: string) => void;
    onDownload?: (dataUrl: string, caption: string) => void;
    onInteractionStart?: () => void;
    isMobile?: boolean;
    origin?: string;
    creator?: string;
    traits?: string;
}

const STATIC_NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ErrorDisplay = ({ cardData }: { cardData?: CardData }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-roboto-mono text-red-400">Image generation failed.</p>
            <p className="text-xs font-roboto-mono text-neutral-500 mt-1">{cardData?.abilityName === "DATA CORRUPTED" ? "Retrying may resolve the issue." : "Network error."}</p>
        </div>
    );
};


const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-permanent-marker text-xl">Upload Photo</span>
    </div>
);


const CyberCard = forwardRef<HTMLDivElement, CyberCardProps>(({ imageUrl, caption, status, error, cardData, dragConstraintsRef, onShake, onDownload, onInteractionStart, isMobile, origin, creator, traits }, ref) => {
    const [isDeveloped, setIsDeveloped] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const frontFaceRef = useRef<HTMLDivElement>(null);
    
    const lastShakeTime = useRef(0);
    const lastVelocity = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (status === 'pending' || (status === 'done' && imageUrl)) {
            setIsDeveloped(false);
            setIsImageLoaded(false);
            setIsFlipped(false); // Flip back to front on regenerate
        }
    }, [imageUrl, status]);

    useEffect(() => {
        if (isImageLoaded) {
            const timer = setTimeout(() => setIsDeveloped(true), 200);
            return () => clearTimeout(timer);
        }
    }, [isImageLoaded]);

    const handleDragStart = () => {
        lastVelocity.current = { x: 0, y: 0 };
    };

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!onShake || isMobile || isFlipped) return;

        const velocityThreshold = 1500;
        const shakeCooldown = 2000;
        const { x, y } = info.velocity;
        const { x: prevX, y: prevY } = lastVelocity.current;
        const now = Date.now();
        const magnitude = Math.sqrt(x * x + y * y);
        const dotProduct = (x * prevX) + (y * prevY);

        if (magnitude > velocityThreshold && dotProduct < 0 && (now - lastShakeTime.current > shakeCooldown)) {
            lastShakeTime.current = now;
            onShake(caption);
        }
        lastVelocity.current = { x, y };
    };

    const handleFlip = () => {
        if ((!imageUrl && caption === "Click to begin") || !origin) {
            return;
        }
        setIsFlipped(prev => !prev);
    };

    const handleDownload = async () => {
        if (!frontFaceRef.current || !onDownload || isDownloading) {
            return;
        }
        setIsDownloading(true);

        try {
            await document.fonts.ready;
            const dataUrl = await toJpeg(frontFaceRef.current, {
                quality: 0.95,
                pixelRatio: 2, // For higher resolution output
            });
            onDownload(dataUrl, caption);
        } catch (err) {
            console.error('Failed to capture card image:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const cardInnerContent = (
        <div className="w-full bg-neutral-800 shadow-inner flex-grow relative overflow-hidden group">
            {status === 'pending' && <LoadingSpinner />}
            {status === 'error' && <ErrorDisplay cardData={cardData} />}
            {status === 'done' && imageUrl && (
                <>
                    <div className={cn(
                        "absolute top-2 right-2 z-20 flex flex-col gap-2 transition-opacity duration-300"
                    )}>
                        {onDownload && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                                disabled={isDownloading}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Download image for ${caption}`}
                            >
                                {isDownloading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                )}
                            </button>
                        )}
                         {onShake && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onShake(caption); }}
                                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label={`Regenerate image for ${caption}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 32 32" fill="currentColor">
                                    <path d="M16 2A14 14 0 1 0 26.1 23.3l-4.2-2.4A10 10 0 1 1 16 6V1l-7 6 7 6V6Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div
                        className={`absolute inset-0 z-10 bg-black transition-opacity duration-[1500ms] ease-out ${isDeveloped ? 'opacity-0' : 'opacity-100'}`}
                        aria-hidden="true"
                    />
                    <img
                        key={imageUrl}
                        src={imageUrl}
                        alt={caption}
                        onLoad={() => setIsImageLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out`}
                        style={{ opacity: isDeveloped ? 1 : 0 }}
                    />
                    {isDeveloped && (
                        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                            <div className="absolute inset-0" style={{ backgroundImage: `url("${STATIC_NOISE_SVG}")`, opacity: 0.05 }}></div>
                        </div>
                    )}
                </>
            )}
            {status === 'done' && !imageUrl && <Placeholder />}
        </div>
    );

    const frontFace = (
      <div 
        ref={(node) => {
            // Assign to internal ref for individual download
            (frontFaceRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            // Assign to forwarded ref for "Download All"
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
        }}
        className="absolute w-full h-full bg-neutral-900 p-2 rounded-md shadow-lg" style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="relative w-full h-full border-2 border-neutral-700/50 flex flex-col overflow-hidden">
          {/* Neon Glow Effect */}
          <div className="absolute -inset-1 rounded-md bg-fuchsia-500/80 blur-lg -z-10"></div>

          {/* Header */}
          <header className="px-3 pt-2 pb-1 bg-black/30 backdrop-blur-sm border-b-2 border-neutral-700/50">
              <div className="flex justify-between items-center">
                  <div className="font-roboto-mono text-xs uppercase text-cyan-300 bg-cyan-900/50 px-2 py-1 border border-cyan-500/50">
                      {cardData?.faction || (status === 'pending' ? '...' : 'N/A')}
                  </div>
                  <div className="w-12 h-12 bg-neutral-900/80 border-2 border-neutral-600 flex items-center justify-center font-caveat text-2xl text-yellow-400" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                      {cardData?.power || 0}
                  </div>
              </div>
               <div className="h-16 flex items-center justify-center mt-[-1rem]">
                    <h2 className="font-caveat text-2xl text-center text-neutral-100 uppercase tracking-widest leading-tight">
                        {caption}
                    </h2>
                </div>
          </header>
          
          {/* Image Container */}
          <div className="flex-grow p-2">
            <div className="w-full h-full bg-black">
              {cardInnerContent}
            </div>
          </div>

          {/* Footer */}
          {caption !== "Click to begin" && (
            <footer className="px-3 pb-2 pt-1 bg-black/30 backdrop-blur-sm border-t-2 border-neutral-700/50">
                <div className="bg-neutral-900/70 p-2 border border-neutral-600/80">
                    <h3 className="font-permanent-marker text-sm text-yellow-400 uppercase tracking-wider">
                      {cardData?.abilityName || '...'}
                    </h3>
                    <p className="font-roboto-mono text-xs text-neutral-300 leading-tight mt-1 h-10">
                      {cardData?.abilityDescription || '...'}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-1 font-roboto-mono text-xs text-neutral-400">
                    <p>DEF: {cardData?.defense || 0}</p>
                    <p>{cardData?.serialNumber || '...'}</p>
                </div>
            </footer>
          )}
        </div>
      </div>
    );
    
    const backFace = (
        <div className="absolute w-full h-full bg-neutral-900 rounded-md shadow-lg p-4 flex flex-col text-green-400/90 font-mono text-xs overflow-hidden" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
            <h3 className="text-base text-green-300 font-bold border-b border-green-400/30 pb-1 mb-2 font-permanent-marker tracking-wider">DOSSIER</h3>
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-transparent">
                <p><span className="text-green-500 font-bold">Subject:</span> {caption}</p>
                <p className="mt-1"><span className="text-green-500 font-bold">Origin:</span> {origin}</p>
                <p className="mt-1"><span className="text-green-500 font-bold">Source:</span> {creator}</p>
                <p className="mt-2 text-green-400 whitespace-pre-wrap">{traits}</p>
            </div>
        </div>
    );

    const cardDimensions = "aspect-[0.72] h-[28rem]";

    if (isMobile) {
        return (
            <div className={cn(cardDimensions, "w-full max-w-sm")} style={{ perspective: '1000px' }} onClick={handleFlip}>
                <motion.div 
                    ref={cardRef}
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {frontFace}
                    {backFace}
                </motion.div>
            </div>
        );
    }
    
    return (
        <DraggableCardContainer>
            <DraggableCardBody 
                className={cn("!bg-transparent !p-0 shadow-none", cardDimensions, "w-80")}
                dragConstraintsRef={dragConstraintsRef}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onTap={handleFlip}
                onInteractionStart={onInteractionStart}
            >
                <motion.div
                    ref={cardRef}
                    className="w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                   {frontFace}
                   {backFace}
                </motion.div>
            </DraggableCardBody>
        </DraggableCardContainer>
    );
});

export default CyberCard;