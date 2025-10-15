/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateStyledImage, generateCardData } from './services/geminiService';
import CyberCard from './components/PolaroidCard';
import Footer from './components/Footer';
import GlitchBackground from './components/GlitchBackground';
import type { Archetype, CardData } from './services/geminiService';
import CyberculturePage from './components/CyberculturePage';

const ARCHETYPES: Archetype[] = [
    // Original 6
    {
      title: "Street Samurai",
      description: "Street Samurai with mirrored cybernetic eye implants and retractable blade housings visible at knuckles, athletic combat-ready build",
      origin: "Book",
      creator: "William Gibson – Neuromancer (1984)",
      traits: "Key Character: Molly Millions.\nTraits: Mirrored corneal implants, retractable finger blades, enhanced reflexes, ruthless efficiency. A mercenary whose body is a weapon, often with a traumatic past driving a detached, professional present."
    },
    {
      title: "Console Cowboy",
      description: "Console Cowboy with neural interface sockets at temples and base of skull, gaunt features, exhausted expression, minimal visible chrome",
      origin: "Book",
      creator: "William Gibson – Neuromancer (1984)",
      traits: "Key Character: Case.\nTraits: Burned-out data thief, neural interface dependency, physical world detachment, nihilistic pragmatism. Operates in cyberspace, treating the physical body as 'meat'—a necessary inconvenience."
    },
    {
      title: "Corporate Enforcer",
      description: "Corporate Enforcer with subtle internal augmentations, unnervingly perfect features, predatory stillness, enhanced physique",
      origin: "Genre Archetype",
      creator: "Blade Runner (1982), Altered Carbon (2002)",
      traits: "Key Examples: Deckard, Takeshi Kovacs.\nTraits: Unnervingly perfect features, subtle high-grade augmentations, predatory stillness, enhanced physique. Represents the unchecked power of corporations, operating with cold, clinical lethality."
    },
    {
      title: "Netrunner",
      description: "Netrunner with prominent cranial implants and glowing data ports, cybernetic eyes displaying active HUD, circuit patterns visible under skin at temples and neck",
      origin: "Tabletop RPG",
      creator: "Mike Pondsmith – Cyberpunk 2020 (1988)",
      traits: "Key Examples: Rache Bartmoss, Alt Cunningham.\nTraits: Prominent cranial data ports, cybernetic eyes with HUDs, direct brain-computer interface. Masters of the Net, capable of infiltrating secure systems and battling hostile AIs."
    },
    {
      title: "Cyborg Operative",
      description: "Full-Body Cyborg with seamless prosthetic limbs showing panel lines and joint articulation, synthetic skin, glowing optical sensors",
      origin: "Manga/Anime",
      creator: "Masamune Shirow – Ghost in the Shell (1989)",
      traits: "Key Character: Major Motoko Kusanagi.\nTraits: Full-body cybernetic prosthesis, seamless synthetic skin, enhanced strength and agility, philosophical questions of identity. A military-grade operative whose humanity is debated."
    },
    {
      title: "Dying Mercenary",
      description: "Dying Merc with eclectic street-grade cyberware, mantis blades or arm-mounted weapons, visible neon-traced implants, rough aftermarket modifications",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2077 (2020), Johnny Mnemonic (1995)",
      traits: "Key Examples: V, Johnny Mnemonic.\nTraits: Eclectic, street-grade cyberware, visible damage, often on a final, desperate job. A character defined by borrowed time, pushing their failing body and tech to the absolute limit."
    },
    // New 14
    {
      title: "Ripperdoc",
      description: "Back-alley cyberware surgeon with magnification optics over one eye, steady hands with micro-tool augments, clinical detachment in expression, and their own experimental self-modifications visible.",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2020/2077, Neuromancer",
      traits: "Augmentation: Tool-integrated prosthetics, enhanced vision, steady-hand stabilizers.\nFashion: Bloodstained surgical scrubs or apron over street clothes.\nMood: Analytical gaze, professional detachment masking an illegal operation."
    },
    {
      title: "Corpo Fixer",
      description: "High-level corporate dealmaker with expensive subtle augments, perfectly maintained appearance, cold calculating eyes with a market data HUD overlay, and a predatory executive presence.",
      origin: "Genre Archetype",
      creator: "Shadowrun, Altered Carbon",
      traits: "Augmentation: Luxury-tier invisible chrome—subdermal comms, neural stock market interface.\nFashion: Immaculately tailored suit with integrated smart-fabric.\nMood: Dominant, complete control, a smile that doesn't reach the eyes."
    },
    {
      title: "Boosterganger",
      description: "Chrome-junkie street psycho, over-chromed with mismatched augments, wild eyes suggesting the edge of cyberpsychosis, aggressive body language, and manic energy.",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2020, Akira",
      traits: "Augmentation: Excessive and garish, LEDs and neon traces, obvious weapon systems, glitching or jury-rigged systems.\nFashion: Gang colors, torn clothing revealing chrome, combat boots.\nMood: Aggressive, unhinged, looking for violence."
    },
    {
      title: "Nomad Tech",
      description: "Desert survival specialist with sun-weathered skin, practical augments for harsh environments, and dust and sand in every crevice. Resourceful eyes and a clear sense of clan loyalty.",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2077, Mad Max",
      traits: "Augmentation: Ruggedized chrome with sand-proof seals, solar charging panels, vehicle interface ports.\nFashion: Layered practical clothing, keffiyeh or bandana, worn leather jacket with clan patches.\nMood: Self-reliant, suspicious of outsiders but honorable."
    },
    {
      title: "Media Personality",
      description: "An always-on broadcast journalist with camera-ready appearance even in danger zones, neural recording implants, and charismatic but calculated expressions.",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2020, Max Headroom",
      traits: "Augmentation: Integrated eye-camera systems, audio recording implants, lie-detection HUD.\nFashion: Practical field journalism gear with 'PRESS' credentials prominently displayed.\nMood: Confident presence in chaos, truth-seeker determination."
    },
    {
      title: "Braindance Editor",
      description: "A digital experience sculptor, pale from living in virtuality. A neural interface crown is permanently attached, with a distant expression from constant immersion in the memories of others.",
      origin: "Genre Archetype",
      creator: "Cyberpunk 2077, Strange Days (1995)",
      traits: "Augmentation: Heavy neural interface array, enhanced memory storage, emotional dampeners to handle traumatic content.\nFashion: Comfortable indoor wear, hoodie, headphones around neck.\nMood: Absorbed, dissociated from their own body, artistic focus."
    },
    {
      title: "Techno-Shaman",
      description: "An AI mystic who fuses spiritual symbolism with high technology. Ritual scarification sits alongside circuit implants, with a third-eye optical implant and a trance-like expression.",
      origin: "Genre Archetype",
      creator: "Neuromancer, Shadowrun",
      traits: "Augmentation: Implants in sacred geometry patterns, bioluminescent tattoos, crown chakra neural interface.\nFashion: Traditional religious garments with integrated circuitry.\nMood: Meditative, channeling, claiming to see beyond the meat."
    },
    {
      title: "Black Market Courier",
      description: "A zero-notice delivery specialist with a lean, athletic build optimized for parkour. Their enhanced reflexes are obvious in constant micro-movements and alert, scanning eyes.",
      origin: "Genre Archetype",
      creator: "Snow Crash, Mirror's Edge",
      traits: "Augmentation: Leg hydraulics, visual target tracking, encrypted data storage cavity.\nFashion: Form-fitting aerodynamic clothing, courier bag, protective pads.\nMood: Ready to bolt, never at rest, professional paranoia."
    },
    {
      title: "Retired Soldier",
      description: "A war veteran from the corporate conflicts, with military-grade augments showing wear and obsolescence. PTSD is visible in their hypervigilance and thousand-yard stare.",
      origin: "Genre Archetype",
      creator: "Altered Carbon, Deus Ex",
      traits: "Augmentation: Dented milspec combat chrome, glitching tactical HUD, manufacturer marks from a specific conflict era.\nFashion: Surplus military clothing, faded unit patches.\nMood: Defensive, tired of violence but still capable, survivor's guilt."
    },
    {
      title: "Prodigy Hacker",
      description: "An underage neural savant. Cutting-edge augments appear oversized or jury-rigged for their growing body. Brilliant but naive eyes show a mix of rebellion and hero worship.",
      origin: "Genre Archetype",
      creator: "Ender's Game, Neuromancer",
      traits: "Augmentation: Experimental neural interfaces, prototype tech, growth spurts making implants ill-fitting.\nFashion: Youth culture fashion—hoodies, graphic tees, sneakers.\nMood: Confident in digital skills, insecure in physical presence."
    },
    {
      title: "Synthetic Companion",
      description: "An AI in a humanoid shell with unnaturally beautiful features. Perfect skin shows subtle panel lines. Emotionally expressive, but something is slightly off in their uncanny valley.",
      origin: "Genre Archetype",
      creator: "Blade Runner 2049, Ex Machina",
      traits: "Augmentation: Entire body is a synthetic prosthesis, holographic overlays, designed for intimacy not combat.\nFashion: Designer clothing or lingerie suggesting commodity status.\nMood: Programmed seduction or stiff rebellion against it, existential uncertainty."
    },
    {
      title: "Organ Repo Agent",
      description: "A biomechanical debt collector with clinical detachment masking moral compromise. Cold eyes see people as inventory, and their fitness comes from physically demanding work.",
      origin: "Genre Archetype",
      creator: "Repo! The Genetic Opera",
      traits: "Augmentation: Medical-grade scanning optics, surgical implement augments, life-sign monitors.\nFashion: Corporate uniform with medical insignia and tactical elements.\nMood: Patient, predatory, apologetic but unflinching."
    },
    {
      title: "Zero-Day Broker",
      description: "An exploit merchant whose aesthetic is anonymity. A forgettable appearance by design, with eyes that constantly calculate value and nervous energy from handling dangerous information.",
      origin: "Genre Archetype",
      creator: "Shadowrun, Real-world hacker culture",
      traits: "Augmentation: Paranoid security chrome—encrypted neural storage with dead man switches, identity spoofing implants.\nFashion: Generic tech worker appearance, face mask.\nMood: Never comfortable, transactional, trusts no one."
    },
    {
      title: "Slum Doctor",
      description: "A black clinic humanitarian, exhausted but determined. Compassionate eyes hardened by impossible choices. Medical skills are obvious in their careful, steady movements.",
      origin: "Genre Archetype",
      creator: "Street medic culture, Shadowrun",
      traits: "Augmentation: Utilitarian medical augments—diagnostic scanning optics, steady-hand stabilizers, pharmaceutical synthesizers.\nFashion: Worn scrubs, stained white coat.\nMood: Tired but can't stop, moral clarity despite illegal practice."
    }
];

// Pre-defined positions for a scattered look on desktop
const POSITIONS = [
    { top: '5%', left: '10%', rotate: -8 },
    { top: '15%', left: '60%', rotate: 5 },
    { top: '45%', left: '5%', rotate: 3 },
    { top: '2%', left: '35%', rotate: 10 },
    { top: '40%', left: '70%', rotate: -12 },
    { top: '50%', left: '38%', rotate: -3 },
];

const GHOST_CYBERCARDS_CONFIG = [
  { initial: { x: "-150%", y: "-100%", rotate: -30 }, transition: { delay: 0.2 } },
  { initial: { x: "150%", y: "-80%", rotate: 25 }, transition: { delay: 0.4 } },
  { initial: { x: "-120%", y: "120%", rotate: 45 }, transition: { delay: 0.6 } },
  { initial: { x: "180%", y: "90%", rotate: -20 }, transition: { delay: 0.8 } },
  { initial: { x: "0%", y: "-200%", rotate: 0 }, transition: { delay: 0.5 } },
  { initial: { x: "100%", y: "150%", rotate: 10 }, transition: { delay: 0.3 } },
];


type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    cardData?: CardData;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)]";
export const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

function App() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const [sessionArchetypes, setSessionArchetypes] = useState<Archetype[]>([]);
    const [zIndices, setZIndices] = useState<Record<string, number>>({});
    const zIndexCounter = useRef(10);
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [view, setView] = useState<'main' | 'cyberculture'>('main');

    const bringToFront = (title: string) => {
        zIndexCounter.current += 1;
        setZIndices(prev => ({
            ...prev,
            [title]: zIndexCounter.current
        }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({}); // Clear previous results
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage) return;
        setIsLoading(true);
        setAppState('generating');
        
        // Randomly select 6 unique archetypes for this session
        const sampledArchetypes: Archetype[] = [];
        const usedIndices = new Set<number>();
        while (sampledArchetypes.length < 6 && usedIndices.size < ARCHETYPES.length) {
            const randomIndex = Math.floor(Math.random() * ARCHETYPES.length);
            if (!usedIndices.has(randomIndex)) {
                sampledArchetypes.push(ARCHETYPES[randomIndex]);
                usedIndices.add(randomIndex);
            }
        }
        setSessionArchetypes(sampledArchetypes);

        // Initialize z-indices
        const initialZIndices: Record<string, number> = {};
        sampledArchetypes.forEach((archetype, index) => {
            initialZIndices[archetype.title] = index;
        });
        setZIndices(initialZIndices);
        zIndexCounter.current = (sampledArchetypes.length || 0) + 9;

        const initialImages: Record<string, GeneratedImage> = {};
        sampledArchetypes.forEach(archetype => {
            initialImages[archetype.title] = { status: 'pending' };
        });
        setGeneratedImages(initialImages);

        const concurrencyLimit = 2; // Process two at a time
        const archetypesQueue = [...sampledArchetypes];

        const processArchetype = async (archetype: Archetype) => {
            try {
                // Generate image and data in parallel
                const [resultUrl, cardData] = await Promise.all([
                    generateStyledImage(uploadedImage, archetype),
                    generateCardData(archetype)
                ]);

                setGeneratedImages(prev => ({
                    ...prev,
                    [archetype.title]: { status: 'done', url: resultUrl, cardData: cardData },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                // Even on error, fetch card data to display something
                const cardData = await generateCardData(archetype);
                setGeneratedImages(prev => ({
                    ...prev,
                    [archetype.title]: { status: 'error', error: errorMessage, cardData },
                }));
                console.error(`Failed to generate image for ${archetype.title}:`, err);
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (archetypesQueue.length > 0) {
                const archetype = archetypesQueue.shift();
                if (archetype) {
                    await processArchetype(archetype);
                }
            }
        });

        await Promise.all(workers);

        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateArchetype = async (title: string) => {
        if (!uploadedImage) return;

        // Prevent re-triggering if a generation is already in progress
        if (generatedImages[title]?.status === 'pending') {
            return;
        }
        
        const archetype = ARCHETYPES.find(a => a.title === title);
        if (!archetype) {
            console.error(`Could not find archetype for title: ${title}`);
            return;
        }
        
        console.log(`Regenerating image for ${archetype.title}...`);

        setGeneratedImages(prev => ({
            ...prev,
            [archetype.title]: { ...prev[archetype.title], status: 'pending' },
        }));

        try {
             // Generate image and data in parallel
            const [resultUrl, cardData] = await Promise.all([
                generateStyledImage(uploadedImage, archetype),
                generateCardData(archetype)
            ]);

            setGeneratedImages(prev => ({
                ...prev,
                [archetype.title]: { status: 'done', url: resultUrl, cardData: cardData },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            const cardData = await generateCardData(archetype);
            setGeneratedImages(prev => ({
                ...prev,
                [archetype.title]: { status: 'error', error: errorMessage, cardData },
            }));
            console.error(`Failed to regenerate image for ${archetype.title}:`, err);
        }
    };
    
    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        setSessionArchetypes([]);
        setZIndices({});
        setAppState('idle');
    };

    const handleDownloadIndividualImage = (title: string) => {
        const image = generatedImages[title];
        if (image?.status === 'done' && image.url) {
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `cyberpunk-persona-${title.toLowerCase().replace(/\s/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <main className="text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
            <GlitchBackground />
            
            {view === 'main' ? (
                <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                    <div className="text-center mb-10">
                        <h1 className="text-6xl md:text-8xl font-nabla text-neutral-100">Cyberpunk Trading Cards</h1>
                        <p className="font-permanent-marker text-neutral-300 mt-2 text-xl tracking-wide">Generate your own custom cards from the dark future.</p>
                    </div>

                    {appState === 'idle' && (
                        <div className="relative flex flex-col items-center justify-center w-full">
                            {/* Ghost cybercards for intro animation */}
                            {GHOST_CYBERCARDS_CONFIG.map((config, index) => (
                                <motion.div
                                    key={index}
                                    className="absolute w-80 h-[26rem] rounded-md p-4 bg-neutral-100/10 blur-sm pointer-events-none"
                                    initial={config.initial}
                                    animate={{
                                        x: "0%", y: "0%", rotate: (Math.random() - 0.5) * 20,
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        ...config.transition,
                                        ease: "circOut",
                                        duration: 2,
                                    }}
                                />
                            ))}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2, duration: 0.8, type: 'spring' }}
                                className="flex flex-col items-center"
                            >
                                <label htmlFor="file-upload" className="cursor-pointer group transform hover:scale-105 transition-transform duration-300">
                                    <CyberCard 
                                        caption="Click to begin"
                                        status="done"
                                    />
                                </label>
                                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                                <p className="mt-8 font-permanent-marker text-neutral-500 text-center max-w-xs text-lg">
                                    Click the card to upload your photo and find your future.
                                </p>
                            </motion.div>
                        </div>
                    )}

                    {appState === 'image-uploaded' && uploadedImage && (
                        <div className="flex flex-col items-center gap-6">
                            <CyberCard 
                                imageUrl={uploadedImage} 
                                caption="Your Photo" 
                                status="done"
                            />
                            <div className="flex items-center gap-4 mt-4">
                                <button onClick={handleReset} className={secondaryButtonClasses}>
                                    Different Photo
                                </button>
                                <button onClick={handleGenerateClick} className={primaryButtonClasses}>
                                    Generate
                                </button>
                            </div>
                        </div>
                    )}

                    {(appState === 'generating' || appState === 'results-shown') && (
                        <>
                            {isMobile ? (
                                <div className="w-full max-w-sm flex-1 overflow-y-auto mt-4 space-y-8 p-4">
                                    {sessionArchetypes.map((archetype) => (
                                        <div key={archetype.title} className="flex justify-center">
                                            <CyberCard
                                                caption={archetype.title}
                                                status={generatedImages[archetype.title]?.status || 'pending'}
                                                imageUrl={generatedImages[archetype.title]?.url}
                                                error={generatedImages[archetype.title]?.error}
                                                cardData={generatedImages[archetype.title]?.cardData}
                                                onShake={handleRegenerateArchetype}
                                                onDownload={handleDownloadIndividualImage}
                                                isMobile={isMobile}
                                                origin={archetype.origin}
                                                creator={archetype.creator}
                                                traits={archetype.traits}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div ref={dragAreaRef} className="relative w-full max-w-5xl h-[600px] mt-4">
                                    {sessionArchetypes.map((archetype, index) => {
                                        const { top, left, rotate } = POSITIONS[index];
                                        return (
                                            <motion.div
                                                key={archetype.title}
                                                className="absolute cursor-grab active:cursor-grabbing"
                                                style={{ top, left, zIndex: zIndices[archetype.title] || 0 }}
                                                initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    scale: 1, 
                                                    y: 0,
                                                    rotate: `${rotate}deg`,
                                                }}
                                                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
                                            >
                                                <CyberCard 
                                                    dragConstraintsRef={dragAreaRef}
                                                    caption={archetype.title}
                                                    status={generatedImages[archetype.title]?.status || 'pending'}
                                                    imageUrl={generatedImages[archetype.title]?.url}
                                                    error={generatedImages[archetype.title]?.error}
                                                    cardData={generatedImages[archetype.title]?.cardData}
                                                    onShake={handleRegenerateArchetype}
                                                    onDownload={handleDownloadIndividualImage}
                                                    onInteractionStart={() => bringToFront(archetype.title)}
                                                    isMobile={isMobile}
                                                    origin={archetype.origin}
                                                    creator={archetype.creator}
                                                    traits={archetype.traits}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="h-20 mt-4 flex items-center justify-center">
                                {appState === 'results-shown' && (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <button onClick={handleReset} className={secondaryButtonClasses}>
                                            Start Over
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <CyberculturePage onBack={() => setView('main')} />
            )}
            <Footer onShowCyberculture={() => setView('cyberculture')} />
        </main>
    );
}

export default App;