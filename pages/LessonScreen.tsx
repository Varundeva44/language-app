
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiGetLesson } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Lesson } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import PhraseCard from '../components/PhraseCard';

const LessonScreen: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            if (!auth.token || !lessonId) return;
            try {
                const data = await apiGetLesson(auth.token, lessonId);
                // Fix: Use a type guard to safely check for the 'error' property on the union type.
                if (data && !('error' in data)) {
                    setLesson(data);
                } else {
                    // Fix: Use optional chaining to safely access 'error' property.
                    setError(data?.error || 'Lesson not found.');
                }
            } catch (err) {
                setError('Failed to fetch lesson details.');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [auth.token, lessonId]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!lesson) return <p className="text-center text-gray-500">No lesson data available.</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/home')} className="mb-6 text-sky-600 hover:underline">
                &larr; Back to Lessons
            </button>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{lesson.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{lesson.description}</p>

            <div className="space-y-4 mb-10">
                {lesson.phrases.map((phrase) => (
                    <PhraseCard key={phrase._id} phrase={{...phrase, sourceLang: lesson.sourceLang, targetLang: lesson.targetLang}} />
                ))}
            </div>

            <div className="text-center">
                <Link
                    to={`/quiz/${lesson._id}`}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 text-xl rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
};

export default LessonScreen;