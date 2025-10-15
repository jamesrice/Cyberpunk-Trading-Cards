/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion } from 'framer-motion';
import { secondaryButtonClasses } from '../App';

interface CyberculturePageProps {
    onBack: () => void;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="font-permanent-marker text-2xl md:text-3xl text-cyan-300 pt-6 border-t border-cyan-500/30 mt-6">
        {children}
    </h2>
);

const SubHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="font-permanent-marker text-xl text-neutral-100 mt-6">
        {children}
    </h3>
);

const KeyInfo: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <p className="mt-1 text-neutral-300">
        <span className="text-cyan-400 font-bold">{title}:</span> {children}
    </p>
);

const CyberculturePage: React.FC<CyberculturePageProps> = ({ onBack }) => {
    return (
        <motion.div 
            className="z-10 w-full max-w-4xl mx-auto p-4 md:p-8 text-neutral-300 flex-grow flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-black/40 backdrop-blur-md border border-neutral-700/50 p-6 md:p-8 rounded-lg max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400/80 scrollbar-track-transparent">
                <h1 className="font-nabla text-5xl md:text-7xl text-center mb-2 text-yellow-300">What is Cyberculture?</h1>
                <h2 className="font-permanent-marker text-xl md:text-2xl text-neutral-300 text-center mb-8">
                    Understanding the Worlds Behind Cyberpunk Trading Cards
                </h2>
                
                <div className="font-roboto-mono space-y-4 text-base leading-relaxed">
                    <p>
                        Cyberpunk Trading Cards transforms you into characters drawn from four decades of cyberpunk literature, film, and interactive media. Each generated image references specific character archetypes, narrative traditions, and visual aesthetics established by the architects of the cyberpunk genre.
                    </p>

                    <SectionHeader>What is Cyberpunk?</SectionHeader>
                    <p>
                        Cyberpunk emerged in the early 1980s as a science fiction subgenre exploring the intersection of "high tech and low life." It imagines near-futures where advanced technology—particularly cybernetics, artificial intelligence, and virtual reality—has proliferated throughout society, yet failed to solve fundamental problems of inequality, corporate dominance, and human alienation.
                    </p>
                    <p>The genre is characterized by:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-neutral-400">
                        <li>Body modification as commodity and identity statement</li>
                        <li>Megacorporations wielding more power than governments</li>
                        <li>Urban decay amid technological advancement</li>
                        <li>Hackers and console cowboys navigating digital frontiers</li>
                        <li>Noir aesthetics: rain, neon, moral ambiguity, cynicism</li>
                        <li>Questions of consciousness, humanity, and what remains when the body becomes a machine</li>
                    </ul>

                    <SectionHeader>Foundational Literature: The Writers Who Built the Genre</SectionHeader>
                    
                    <SubHeader>William Gibson</SubHeader>
                    <KeyInfo title="Key Works"><em>Neuromancer</em> (1984), <em>Count Zero</em> (1986), <em>Mona Lisa Overdrive</em> (1988)</KeyInfo>
                    <p>Gibson coined the term "cyberspace" and established the archetype of the console cowboy—hackers who jack directly into computer networks through neural interfaces. His Sprawl Trilogy introduced Molly Millions (the street samurai with retractable razors and mirrored eyes), Case (the burned-out hacker), and a world where artificial intelligences achieve sentience and godhood.</p>
                    <KeyInfo title="Character DNA">Burned-out hackers seeking redemption, augmented mercenaries with traumatic pasts, corporate operatives navigating zaibatsu politics, AIs manipulating human affairs.</KeyInfo>
                    
                    <SubHeader>Neal Stephenson</SubHeader>
                    <KeyInfo title="Key Works"><em>Snow Crash</em> (1992), <em>The Diamond Age</em> (1995)</KeyInfo>
                    <p>Stephenson brought satirical edge and linguistic theory to cyberpunk. Snow Crash imagined the Metaverse before Facebook rebranded, featuring Hiro Protagonist (hacker-warrior-linguist) and Y.T. (teenage skateboard courier). His worlds blend anarcho-capitalism, ancient Sumerian mythology, and corporate franchise nation-states.</p>
                    <KeyInfo title="Character DNA">Competent specialists with absurd names, teenage survivors gaming dangerous systems, autodidacts elevated by technology, warrior-scholars.</KeyInfo>
                    
                    <SubHeader>Bruce Sterling</SubHeader>
                    <KeyInfo title="Key Works"><em>Schismatrix</em> (1985), <em>Islands in the Net</em> (1988)</KeyInfo>
                    <p>Sterling explored post-human factionalism between Mechanists (machine enhancement) and Shapers (genetic modification). His work emphasizes political intrigue in data havens and the ideological dimensions of body modification.</p>
                    <KeyInfo title="Character DNA">Post-human operatives, political exiles, data diplomats, augmented rebels choosing sides in enhancement wars.</KeyInfo>

                    <SubHeader>Philip K. Dick</SubHeader>
                    <KeyInfo title="Key Work"><em>Do Androids Dream of Electric Sheep?</em> (1968)</KeyInfo>
                    <p>Though predating the cyberpunk movement, Dick's exploration of artificial humanity, empathy as measurable commodity, and reality's fragility established philosophical foundations. His replicants question what makes someone human when consciousness can be manufactured.</p>
                    <KeyInfo title="Character DNA">Bounty hunters questioning their own humanity, artificial beings more human than humans, depression masked as professionalism.</KeyInfo>

                    <SubHeader>Richard K. Morgan</SubHeader>
                    <KeyInfo title="Key Work"><em>Altered Carbon</em> (2002)</KeyInfo>
                    <p>Morgan brought hard-boiled noir to consciousness-transfer technology. When minds can be downloaded and uploaded into new bodies ("sleeves"), death becomes negotiable for the wealthy, while the poor remain mortal. His protagonist Takeshi Kovacs carries trauma across incarnations.</p>
                    <KeyInfo title="Character DNA">Ex-soldiers in borrowed bodies, immortal elites, consciousness as transferable commodity, intimacy complicated by body-swapping.</KeyInfo>


                    <SectionHeader>Cinematic Visions: Films That Defined the Aesthetic</SectionHeader>
                    
                    <SubHeader>Blade Runner (1982) — Directed by Ridley Scott</SubHeader>
                    <p>Based on Dick's novel, Blade Runner established the visual language of cyberpunk cinema: perpetual rain, neon-soaked streets, massive advertising holograms, Asian cultural fusion, and noir atmosphere. Roy Batty's replicant rebellion—"I've seen things you people wouldn't believe"—remains the genre's most poignant meditation on mortality and meaning.</p>
                    <KeyInfo title="Visual DNA">Film noir lighting, neo-Tokyo architecture, trench coats, android ambiguity, existential desperation.</KeyInfo>

                    <SubHeader>Blade Runner 2049 (2017) — Directed by Denis Villeneuve</SubHeader>
                    <p>Villeneuve's sequel expanded the universe with K/Joe, a replicant blade runner yearning for authentic experience and grappling with loneliness. His holographic companion Joi raises questions about love when one partner isn't physically real.</p>
                    <KeyInfo title="Visual DNA">Minimalist brutalism, orange deserts contrasting blue cityscapes, loneliness as default state, gigantic statues and advertising.</KeyInfo>

                    <SubHeader>Ghost in the Shell (1995) — Directed by Mamoru Oshii</SubHeader>
                    <p>This anime masterpiece follows Major Motoko Kusanagi, a full-body cyborg questioning whether consciousness persists when the body is entirely artificial. It explores identity in the digital age with philosophical depth and stunning action sequences.</p>
                    <KeyInfo title="Visual DNA">Thermoptic camouflage, cybernetic bodies with visible seams, philosophical introspection amid tactical violence, Hong Kong-inspired cityscapes.</KeyInfo>

                    <SubHeader>Akira (1988) — Directed by Katsuhiro Otomo</SubHeader>
                    <p>Set in Neo-Tokyo, Akira depicts bōsōzoku biker gangs and psychic experiments gone wrong. Tetsuo's transformation from powerless victim to godlike threat explores adolescent rage and body horror as transcendence.</p>
                    <KeyInfo title="Visual DNA">Motorcycle gang aesthetics, Japanese urban youth culture, body horror transformations, neon Tokyo sprawl, apocalyptic power.</KeyInfo>
                    
                    <SubHeader>The Matrix (1999) — Directed by The Wachowskis</SubHeader>
                    <p>While not pure cyberpunk, The Matrix popularized hacker culture, simulation theory, and the "real world as prison" concept. Its visual style—green digital rain, leather fetish wear, bullet time—became shorthand for cyberpunk in popular culture.</p>
                    <KeyInfo title="Visual DNA">Digital code overlays, all-black tactical fashion, sunglasses indoors, martial arts mixed with gunplay, messianic hacker archetype.</KeyInfo>


                    <SectionHeader>Interactive Worlds: Games That Let You Live Cyberpunk</SectionHeader>
                    <SubHeader>Cyberpunk 2020 (1990) & Cyberpunk 2077 (2020)</SubHeader>
                    <p>Mike Pondsmith's tabletop RPG established character classes still referenced today: Solo (mercenary), Netrunner (hacker), Fixer (dealmaker), Nomad (vehicular tribal), Rockerboy (rebellious musician). CD Projekt Red's 2077 adaptation brought Night City to life with V, a dying mercenary hosting the digital ghost of terrorist rockstar Johnny Silverhand.</p>
                    <KeyInfo title="Character DNA">Every archetype from street samurai to corporate fixers, style over substance as ethos, body modification as character progression, living fast with short life expectancy.</KeyInfo>
                    
                    <SubHeader>Deus Ex Series (2000-2016)</SubHeader>
                    <p>From JC Denton to Adam Jensen, Deus Ex explores augmentation divides creating new social classes. The series asks whether you "asked for this" enhancement or had it forced upon you, examining player agency amid conspiracy and transhumanism.</p>
                    <KeyInfo title="Character DNA">Augmented agents navigating conspiracy, mechanical enhancement creating class conflict, choice architecture revealing morality, paranoia justified.</KeyInfo>

                    <SubHeader>Shadowrun (1989 - Present)</SubHeader>
                    <p>Shadowrun fuses cyberpunk with fantasy, adding magic and metahumans (elves, dwarves, orcs, trolls) to corporate dystopia. Its archetype system—Street Samurai, Decker, Rigger, Shaman—defined character classes for decades of cyberpunk gaming.</p>
                    <KeyInfo title="Character DNA">Chrome-heavy mercenaries, hackers in virtual space, fixers brokering deals, nomadic vehicular tribes, all operating in the shadows.</KeyInfo>

                    <SectionHeader>Character Archetypes: Who You Might Become</SectionHeader>
                    <p>Cyberpunk Trading Cards draws from 20+ character archetypes established across these works. Each transformation places you within specific narrative traditions:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-neutral-400">
                      <li><strong>Street Samurai:</strong> Augmented combat specialists with weapon-integrated bodies (Molly Millions, Adam Smasher)</li>
                      <li><strong>Console Cowboy / Netrunner:</strong> Hackers jacked into cyberspace, physically vulnerable but digitally godlike (Case, Bobby Newmark)</li>
                      <li><strong>Corporate Enforcer:</strong> Company assets with expensive chrome and loyalty chips (Blade Runner's replicants, corporate solos)</li>
                      <li><strong>Full-Body Cyborg:</strong> Consciousness in artificial shells questioning their humanity (Major Kusanagi, Adam Jensen at extremes)</li>
                      <li><strong>Nomad / Rigger:</strong> Desert survivors and vehicle specialists living outside city control (Cyberpunk 2077 Nomads)</li>
                      <li><strong>Ripperdoc:</strong> Black market surgeons installing chrome in back alleys (Viktor Vector, street docs)</li>
                      <li><strong>Corpo Fixer:</strong> High-level dealmakers with invisible augments and expensive taste (shadowbrokers, executive mercenaries)</li>
                      <li><strong>Boostergang Member:</strong> Chrome-addicted psychos over-augmented to psychosis edge (cyberpunk street gangs)</li>
                      <li><strong>Media / Journalist:</strong> Always-recording truth-seekers with broadcast implants (Cyberpunk 2020 Media class)</li>
                      <li><strong>Braindance Editor:</strong> Experience sculptors living in other people's recorded memories (BD tech from CP2077)</li>
                      <li><strong>Synthetic Companion:</strong> AI in humanoid shells designed for intimacy, seeking personhood (Joi, Ava, Pris)</li>
                      <li><strong>Retired Soldier:</strong> Veterans with obsolete military chrome and PTSD (Altered Carbon's Envoys, countless war vets)</li>
                      <li><strong>Zero-Day Broker:</strong> Exploit merchants selling vulnerabilities to highest bidders (security underground personified)</li>
                    </ul>
                    
                    <SectionHeader>Why These References Matter</SectionHeader>
                    <p>Cyberpunk isn't just an aesthetic—it's a critical lens examining technology's impact on humanity. These stories warned about:</p>
                     <ul className="list-disc list-inside space-y-2 pl-4 text-neutral-400">
                        <li>Corporate power exceeding democratic control</li>
                        <li>Technology increasing inequality rather than solving it</li>
                        <li>Bodies becoming contested territories for commerce</li>
                        <li>Surveillance normalized as convenience</li>
                        <li>Consciousness commodified and questioned</li>
                        <li>Class divides hardened through enhancement access</li>
                    </ul>
                    <p>When you transform into a cyberpunk character, you're not just adding neon and chrome. You're stepping into narratives about autonomy, identity, and what remains human when flesh becomes optional. These aren't escapist fantasies—they're cautionary tales about futures we're actively building.</p>
                    <p>The genre's influence extends beyond fiction into design, fashion, video games, and tech culture itself. Many Silicon Valley founders cite these works as inspiration, though often missing the genre's critical stance toward unchecked technological capitalism.</p>

                    <SectionHeader>Recommended Entry Points</SectionHeader>
                    <p>New to cyberpunk? Start here:</p>
                    <ul className="space-y-2 pl-4 text-neutral-400">
                        <li><strong>Film:</strong> <em>Blade Runner</em> (1982) — The visual foundation of the genre</li>
                        <li><strong>Novel:</strong> <em>Neuromancer</em> by William Gibson — The book that named cyberspace</li>
                        <li><strong>Anime:</strong> <em>Ghost in the Shell</em> (1995) — Philosophy meets action</li>
                        <li><strong>Game:</strong> <em>Cyberpunk 2077</em> — Immersive Night City despite rocky launch</li>
                        <li><strong>TV Series:</strong> <em>Altered Carbon Season 1</em> — Body-swapping noir mystery</li>
                    </ul>
                    <p>Every character generated by Cyberpunk Trading Cards carries DNA from these worlds. You're not just wearing a costume—you're inhabiting decades of speculative fiction asking hard questions about who we become when technology rewrites the human condition.</p>
                    <p>Welcome to the future. It's high tech and low life, just like they promised.</p>

                    <p className="text-right pt-4 text-neutral-500">— Team Fiction Tribe</p>
                </div>
            </div>

            <div className="text-center mt-8">
                <button onClick={onBack} className={secondaryButtonClasses}>
                    Back to Generator
                </button>
            </div>
        </motion.div>
    );
};

export default CyberculturePage;
