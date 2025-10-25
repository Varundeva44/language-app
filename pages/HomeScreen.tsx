
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetLessons } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { LessonSummary } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const HomeScreen: React.FC = () => {
    const [lessons, setLessons] = useState<LessonSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useAuth();

    useEffect(() => {
        const fetchLessons = async () => {
            if (!auth.token) return;
            try {
                // Fix: Cast the response to allow for an error object, preventing 'never' type error.
                const data = await apiGetLessons(auth.token) as LessonSummary[] | { error: string };
                if (Array.isArray(data)) {
                    // Filter lessons based on user's language preference
                    const userLessons = data.filter(lesson => 
                        lesson.sourceLang === auth.user?.sourceLang && 
                        lesson.targetLang === auth.user?.targetLang
                    );
                    setLessons(userLessons);
                } else if (data.error) {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch lessons.');
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [auth.token, auth.user]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Lessons</h2>
            <p className="text-lg text-gray-600 mb-6">Learn survival phrases for everyday situations.</p>
            
            {lessons.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No lessons available for {auth.user?.sourceLang} to {auth.user?.targetLang} yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lessons.map((lesson) => (
                        <Link to={`/lesson/${lesson._id}`} key={lesson._id} className="block group">
                            <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                <div>
                                    <h3 className="text-xl font-bold text-sky-700 mb-2">{lesson.title}</h3>
                                    <p className="text-gray-600 text-sm">{lesson.description}</p>
                                </div>
                                <span className="mt-4 text-sm font-semibold text-sky-600 self-start group-hover:underline">
                                    Start Lesson →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeScreen;