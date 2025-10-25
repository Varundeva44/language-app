
import React from 'react';
import { useLocation, Link, useParams, Navigate } from 'react-router-dom';
import { QuizAnswer } from '../types';

const ResultScreen: React.FC = () => {
    const location = useLocation();
    const { lessonId } = useParams<{ lessonId: string }>();
    
    if (!location.state) {
        // Redirect if state is not available (e.g., direct navigation)
        return <Navigate to={`/lesson/${lessonId}`} />;
    }

    const { score, answers } = location.state as { score: number; answers: QuizAnswer[] };

    return (
        <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white shadow-2xl rounded-xl p-8">
                <h1 className="text-5xl font-extrabold mb-4">
                    {score >= 70 ? '🎉 Great Job! 🎉' : '👍 Keep Practicing! 👍'}
                </h1>
                <p className="text-2xl text-gray-700 mb-6">Your Score:</p>
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-48 h-48">
                        <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="82" cx="96" cy="96" />
                        <circle
                            className="text-sky-500"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 82}
                            strokeDashoffset={(2 * Math.PI * 82) * (1 - score / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="82"
                            cx="96"
                            cy="96"
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                    </svg>
                    <span className="absolute text-5xl font-bold text-sky-700">{score}%</span>
                </div>
                
                <div className="mt-8 text-left">
                    <h3 className="text-xl font-bold mb-4">Review Your Answers:</h3>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {answers.map((ans, index) => (
                            <li key={index} className={`p-3 rounded-lg ${ans.correct ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'}`}>
                                <p className="font-semibold text-gray-800">{ans.questionText}</p>
                                <p className="text-sm text-gray-600">Your answer: <span className={ans.correct ? 'text-green-700' : 'text-red-700'}>{ans.chosenAnswer}</span></p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to={`/lesson/${lessonId}`} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Review Lesson
                    </Link>
                    <Link to="/home" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;
