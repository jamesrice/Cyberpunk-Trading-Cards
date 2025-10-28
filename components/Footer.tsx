/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface FooterProps {
    onShowCyberculture: () => void;
    onStartOver: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowCyberculture, onStartOver }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 z-50 text-neutral-300 text-xs sm:text-sm border-t border-white/10">
            <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center sm:justify-between items-center px-4 gap-y-2">
                <div className="flex items-center gap-4 text-neutral-400">
                    <p>Powered by Gemini</p>
                    <span className="text-neutral-700" aria-hidden="true">|</span>
                    <p>
                        Created by{' '}
                        <a
                            href="https://fictiontribe.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-300 hover:text-yellow-400 transition-colors duration-200"
                        >
                            FICTION TRIBE
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onShowCyberculture}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-permanent-marker tracking-wide"
                    >
                        What is Cyberculture?
                    </button>
                    <span className="text-neutral-700" aria-hidden="true">|</span>
                    <button
                        onClick={onStartOver}
                        className="text-neutral-300 hover:text-yellow-400 transition-colors duration-200 font-permanent-marker tracking-wide"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;