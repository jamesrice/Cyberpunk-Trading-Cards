/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// Gemini runs server-side now (see functions/api/*). The API key lives on the
// Cloudflare Pages project as a secret and never reaches the browser — this
// module only builds prompts and calls our own same-origin /api endpoints.

export interface Archetype {
    title: string;
    description: string;
    origin: string;
    creator: string;
    traits: string;
}

export interface CardData {
    abilityName: string;
    abilityDescription: string;
    faction: string;
    power: number;
    defense: number;
    serialNumber: string;
}

// --- Helper Functions and Data for Prompt Generation ---

const STUDIO_ELEMENTS = [
  '8–10 ribbons of caution tape, stretched taut and flat, floating freely in studio space, arranged diagonally and horizontally in layered criss-cross pattern, some behind model, some in midground crossing in front of torso and legs with clear space, few in foreground slightly blurred, NEVER touching or wrapping around the model',
  'Holographic data streams flowing vertically and diagonally around the character, translucent blue and cyan code cascading through space, some streams behind, some in front creating depth, never intersecting with the body',
  'Shattered mirror fragments suspended in mid-air around the character, each reflecting different neon colors, arranged in orbital pattern at varying distances, creating geometric composition, fragments never touching model',
  'Neon light tubes (practical, not CGI) arranged in parallel vertical and horizontal lines creating a grid cage effect around character, tubes at multiple depths, cold cathode glow in cyan and magenta, floating with space between character',
  'Streams of carbon fiber ribbon flowing diagonally through the frame, matte black with metallic edge catch-lights, some bunched, some stretched taut, layered depth with foreground blur, organic S-curves never contacting model',
  'Industrial chain links suspended on tensioned wires creating diagonal crosshatch patterns, heavy metal texture, some razor-sharp focus in foreground, some soft in background, chrome and rust finish',
  'Translucent acrylic sheets positioned at angles around character, each tinted different neon color (pink, cyan, yellow, green), creating color-blocking composition, sheets never touch model, visible edge lighting',
  'Fiber optic cable bundles arranged in sweeping curves through 3D space, tips glowing multiple colors, some bundles thick, some thin, creating depth layers, cybernetic aesthetic, clear separation from character'
];

const BACKGROUNDS = [
  'Deep black void with subtle RGB chromatic aberration edges',
  'Yellow to neon yellow gradient',
  'Cyan to deep blue gradient with scan line texture',
  'Magenta to purple gradient with digital noise',
  'Green screen-glow to black gradient',
  'White to pale blue clinical gradient with subtle grid overlay',
  'Orange sodium vapor to black gradient',
  'Red emergency lighting to darkness gradient',
  'Teal to turquoise gradient with holographic shimmer'
];

const MOODS = [
  'Powerful and defiant',
  'Calculating and cold',
  'Exhausted but determined',
  'Predatory and threatening',
  'Philosophical and detached',
  'Desperate and cornered',
  'Confident and stylish',
  'Paranoid and alert'
];

const CAMERA_STYLES = [
  'Shot on a Sony A7R IV with a Zeiss Planar T* 85mm f/1.4 lens. Emulate the fine grain and color science of Kodak Portra 400 film.',
  'Photographed with a Hasselblad X1D II 50C, 90mm f/3.2 lens. The image should have the deep, moody tones and fine detail characteristic of Fujifilm Pro 400H film stock.',
  'Captured on a Leica M11 with a Summilux-M 50mm f/1.4 ASPH lens. Replicate the sharp, cinematic look and natural color rendering of CineStill 800T film.',
  'Shot with a Canon EOS R5 and a RF 85mm f/1.2 L USM lens. The aesthetic should mimic the vibrant, saturated look of Kodak Ektar 100 film, with extremely fine grain.',
  'Photographed on a Phase One XF IQ4 150MP with a Schneider Kreuznach 110mm LS f/2.8 lens. Emulate the unparalleled detail and subtle color palette of medium format digital photography, with a touch of filmic grain.'
];

const LIGHTING_SETUPS = [
  'Cinematic three-point lighting. A large, diffused octabox softbox as the key light, positioned 45 degrees from the subject to create soft facial shadows. A gridded strip light for a sharp rim light, separating the character from the background. A large white reflector for subtle fill.',
  'Dramatic Rembrandt lighting using a single, gridded beauty dish positioned high and to the side, creating a triangle of light on the cheek. A V-flat reflector on the opposite side to gently lift shadows. The background is lit separately with a blue gelled strobe.',
  'High-fashion clamshell lighting. Two softboxes, one above and one below the subject\'s face, creating a flattering, near-shadowless look. Edge lights with magenta gels on either side to define the subject\'s form.',
  'Hard, edgy lighting from a single bare-bulb strobe placed slightly above and to one side, creating deep, defined shadows and specular highlights on chrome and skin. A large black flag is used to increase contrast by absorbing bounce light.',
  'Cross-lighting setup with two gridded strip boxes on either side of the subject, slightly behind them. This carves out their shape with bright rim lights, leaving the front in relative shadow, filled only by ambient bounce from a white floor.'
];


interface ArchetypeSpecifics {
    prop: string;
    costume: string;
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns specific prop and costume details based on the archetype.
 * @param archetypeTitle The title of the character archetype.
 * @returns An object containing strings for the prop and costume.
 */
function getArchetypeSpecifics(archetypeTitle: string): ArchetypeSpecifics {
    const title = archetypeTitle.toLowerCase();

    // Non-combat / role-specific props
    if (title.includes('ripperdoc')) {
        return {
            prop: 'holding a sterile, high-tech laser scalpel with focused intensity',
            costume: 'wearing a blood-spattered, ragged white medical overcoat over dark, functional street clothes.'
        };
    }
    if (title.includes('console cowboy') || title.includes('netrunner') || title.includes('prodigy hacker')) {
        return {
            prop: getRandomElement([
                'interacting with a floating holographic data screen displaying cascading code',
                'wearing sleek AR data-goggles with glowing reticles, one hand raised to manipulate virtual data',
                'holding a small, custom-built hacking device with a tangle of fiber-optic cables attached'
            ]),
            costume: 'wearing comfortable, worn-out hoodie and cargo pants, adorned with patches from various hacker groups and old tech brands.'
        };
    }
    if (title.includes('corpo fixer')) {
        return {
            prop: 'holding a sleek, translucent datapad displaying glowing stock market data',
            costume: 'wearing a perfectly tailored, high-fashion corporate suit made of smart-fabric with subtle, integrated circuitry.'
        };
    }
     if (title.includes('boosterganger')) {
        return {
            prop: 'wielding a heavy industrial pipe wrench with makeshift spikes welded on',
            costume: 'wearing torn gang-colored clothing over mismatched, glitching chrome limbs.'
        };
    }
    if (title.includes('nomad tech')) {
        return {
            prop: 'holding a rugged, sand-worn diagnostic tool, checking readings on its small screen',
            costume: 'wearing layered, practical clothing and a worn leather jacket with their clan\'s patch.'
        };
    }
    if (title.includes('media personality')) {
        return {
            prop: 'holding a microphone with a glowing media-corp logo up to an unseen source',
            costume: 'wearing practical field journalism gear with \'PRESS\' credentials prominently displayed.'
        };
    }
     if (title.includes('braindance editor')) {
        return {
            prop: 'wearing a complex neural interface crown, with ethereal light emanating from it as they manipulate a 3D holographic memory with data-gloves',
            costume: 'wearing comfortable, almost pajama-like indoor wear, showing a detachment from the physical world.'
        };
    }
    if (title.includes('techno-shaman')) {
        return {
            prop: 'holding a staff that\'s a fusion of ancient, gnarled wood and glowing, integrated circuitry',
            costume: 'wearing traditional religious-style garments interwoven with fiber optic threads.'
        };
    }
    if (title.includes('black market courier')) {
        return {
            prop: 'clutching a heavily encrypted data-chip between their fingers, held close to their chest',
            costume: 'wearing form-fitting aerodynamic clothing and a high-tech, armored courier bag.'
        };
    }
    if (title.includes('retired soldier')) {
        return {
            prop: 'holding a pair of dog tags from a past corporate war, staring at them reflectively',
            costume: 'wearing surplus military clothing with faded unit patches and visible signs of wear.'
        };
    }
    if (title.includes('synthetic companion')) {
        return {
            prop: 'holding a single, perfect, bio-luminescent flower, observing it with a curious expression',
            costume: 'wearing elegant designer clothing, suggesting a commodity status or a desire to fit in.'
        };
    }
    if (title.includes('organ repo agent')) {
        return {
            prop: 'holding a medical-grade organ transport case with a glowing bio-hazard symbol',
            costume: 'wearing a corporate uniform with medical insignia and tactical, armored elements.'
        };
    }
    if (title.includes('zero-day broker')) {
        return {
            prop: 'subtly examining a burner dataphone that displays encrypted information',
            costume: 'wearing a generic, forgettable tech-worker outfit, with a face-obscuring mask or high collar.'
        };
    }
    if (title.includes('slum doctor')) {
        return {
            prop: 'holding a medical auto-injector (stim-hypo), preparing to administer it',
            costume: 'wearing worn medical scrubs and a stained, old-fashioned doctor\'s coat.'
        };
    }
    
    // Combat-oriented archetypes (fallback with specific costumes)
    if (title.includes('street samurai')) {
         return {
            prop: 'wielding a razor-sharp, mono-molecular katana in a low guard stance',
            costume: 'wearing a mix of street fashion and lightweight armor, like an armored kimono or reinforced leather jacket.'
        };
    }
    if (title.includes('corporate enforcer')) {
        return {
            prop: 'holding a sleek, high-end corporate-issue smart pistol at a low ready',
            costume: 'wearing an immaculate, armored business suit that allows for movement while providing protection.'
        };
    }
     if (title.includes('cyborg operative')) {
        return {
            prop: 'showing off a fully integrated cybernetic arm that is transforming into a plasma cannon',
            costume: 'wearing a form-fitting tactical bodysuit that interfaces with their full-body prosthesis.'
        };
    }
    if (title.includes('dying mercenary')) {
        return {
            prop: 'clutching a battle-worn, heavily modified assault rifle',
            costume: 'wearing eclectic street-grade gear and armor, with visible damage and jury-rigged repairs.'
        };
    }

    // Generic fallback if no specific match is found
    const randomWeapon = getRandomElement([
        'a sleek smart pistol with a digital display',
        'a compact submachine gun with neon accent lights',
        'a plasma katana with an energy blade',
        'a heavy cybernetic arm cannon integrated into a prosthetic limb',
        'a high-caliber revolver with custom engravings'
    ]);
    return {
        prop: `holding a ${randomWeapon} in a ready stance, but not aimed directly at the camera.`,
        costume: 'wearing a mix of functional, worn tactical gear and dark, futuristic street fashion.'
    };
}


/**
 * Creates the primary, detailed prompt for the AI model.
 * @param archetype The character archetype object.
 * @returns The detailed prompt string.
 */
function createPrompt(archetype: Archetype): string {
    const { prop, costume } = getArchetypeSpecifics(archetype.title);
    const randomStudioElement = getRandomElement(STUDIO_ELEMENTS);
    const randomBackground = getRandomElement(BACKGROUNDS);
    const randomMood = getRandomElement(MOODS);
    const randomCameraStyle = getRandomElement(CAMERA_STYLES);
    const randomLightingSetup = getRandomElement(LIGHTING_SETUPS);

    return `Award-winning, hyperrealistic, professional full-body studio photograph of a single cyberpunk character.

PHOTOGRAPHY STYLE: Raw, authentic, hyperrealistic studio portrait. ${randomCameraStyle} Sharp focus on the eyes and cybernetics.

NEGATIVE PROMPT (STRICT): NO illustrations, paintings, CGI, 3D renders, anime, cartoons, airbrushing. NO plastic-looking skin, NO overly smooth surfaces, NO video game aesthetics, NO Unreal Engine or Octane render look, NO perfect symmetry. The output MUST be indistinguishable from a real photo. Any hint of digital art is a failure.

CHARACTER ARCHETYPE: ${archetype.description}.

AUGMENTATION DETAILS: All cyberware must appear surgically integrated into the facial structure and body—not overlaid. Chrome and prosthetics should show realistic material properties with PBR shaders: reflections, fingerprints, micro-scratches, wear, and panel seams. Include subtle real-world details like the reflection of the studio softbox in the character's cybernetic eyes. Glowing elements (if present) emit subtle colored light affecting nearby skin tones.

PROP AND ACTION: The character is ${prop}. The prop's style should match the character archetype's aesthetic.

STUDIO ELEMENT: ${randomStudioElement}.

BACKGROUND: ${randomBackground}.

LIGHTING SETUP: ${randomLightingSetup} The lighting must be clean, professional, and enhance the realism without distracting volumetric effects or lens flares. Include subtle real-world details like faint dust motes caught in the light beams.

MOOD: ${randomMood}.

COSTUME DETAILS: ${costume}. Clothing should show realistic fabric textures, creases, and subtle wear.

FACIAL INTEGRATION CRITICAL: The uploaded face must be seamlessly composited with: correct perspective matching body pose, lighting continuity across all facial features, cyberware appearing to emerge from or replace facial structures authentically, skin tone consistency between face and visible body parts, appropriate aging and weathering matching archetype, and authentic expressions (not generic smile—match mood). The final composite must maintain realistic skin texture with visible pores, subtle micro-blemishes, and natural asymmetry.

Final output must be an ultra-detailed professional fashion photograph, cinematic color grading with a cyberpunk color palette, sharp focus on face and augmentations, professional retouching that maintains skin texture and mechanical detail, 8K resolution quality.`;
}


/**
 * Generates a styled cyberpunk portrait from a source image and archetype.
 * The Gemini call runs server-side (/api/generate-image) so the key never
 * reaches the browser; the detailed prompt is still built here and sent up.
 * Throws on failure so the caller can render the card's error state.
 */
export async function generateStyledImage(imageDataUrl: string, archetype: Archetype): Promise<string> {
  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
  }
  const [, mimeType, base64Data] = match;

  let res: Response;
  try {
    res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Data, mimeType, prompt: createPrompt(archetype) }),
    });
  } catch (err) {
    throw new Error(`Could not reach the image engine. ${err instanceof Error ? err.message : ''}`.trim());
  }

  let data: { image?: string; error?: string };
  try {
    data = await res.json();
  } catch {
    throw new Error('The image engine returned an unreadable response.');
  }
  if (!data.image) {
    throw new Error(data.error || 'The AI model failed to generate an image.');
  }
  return data.image;
}

/**
 * Generates trading-card stats for an archetype via /api/generate-card.
 * Always resolves: any failure yields a themed fallback card, so a single bad
 * response never breaks the grid.
 */
export async function generateCardData(archetype: Archetype): Promise<CardData> {
  const fallback: CardData = {
    abilityName: "DATA CORRUPTED",
    abilityDescription: "Transmission from the old net failed. Unable to parse combat data.",
    faction: "Unknown",
    power: 0,
    defense: 0,
    serialNumber: "ERROR-404",
  };

  try {
    const res = await fetch('/api/generate-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: archetype.title, description: archetype.description }),
    });
    const data = (await res.json()) as Partial<CardData> & { error?: string };
    if (data.error) {
      console.error(`Card data error for ${archetype.title}: ${data.error}`);
      return fallback;
    }
    if (typeof data.power !== 'number' || typeof data.defense !== 'number' || typeof data.abilityName !== 'string') {
      throw new Error("Model returned data with incorrect types.");
    }
    return data as CardData;
  } catch (e) {
    console.error(`Failed to generate or parse card data for ${archetype.title}:`, e);
    return fallback;
  }
}