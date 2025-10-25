
import React from 'react';
import { Phrase } from '../types';
import { SpeakerIcon } from './icons/Icons';

interface PhraseCardProps {
    phrase: Phrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
    const playAudio = (url: string) => {
        if (url) {
            const audio = new Audio(url);
            audio.play().catch(e => console.error("Error playing audio:", e));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">{phrase.sourceLang || 'Source'}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-800">{phrase.sourceText}</p>
                        <button
                            onClick={() => playAudio(phrase.sourceAudioUrl)}
                            disabled={!phrase.sourceAudioUrl}
                            className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                            aria-label="Play source text audio"
                        >
                            <SpeakerIcon />
                        </button>
                    </div>
                </div>
                <hr className="my-4 border-t border-gray-200"/>
                <div>
                    <p className="text-sm text-gray-500">{phrase.targetLang || 'Target'}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-sky-700">{phrase.targetText}</p>
                        <button
                            onClick={() => playAudio(phrase.targetAudioUrl)}
                            disabled={!phrase.targetAudioUrl}
                            className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                            aria-label="Play target text audio"
                        >
                            <SpeakerIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhraseCard;
