
import React, { useState, useEffect } from 'react';
import { apiGetProgress } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserProfile, UserProgressItem } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useAuth();

    useEffect(() => {
        const fetchProgress = async () => {
            if (!auth.token) return;
            try {
                const data = await apiGetProgress(auth.token);
                // Fix: Use a type guard to safely check for the 'error' property on the union type.
                if (data && !('error' in data)) {
                    setProfile(data);
                } else {
                    // Fix: Use optional chaining to safely access 'error' property.
                    setError(data?.error || 'Profile not found.');
                }
            } catch (err) {
                setError('Failed to fetch profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [auth.token]);
    
    const overallProgress = profile?.progress ? (profile.progress.filter(p => p.completed).length / profile.progress.length) * 100 : 0;


    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!profile) return <p className="text-center">Could not load profile.</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
                <h2 className="text-4xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-lg text-gray-600 mt-2">
                    Learning <span className="font-semibold text-sky-700">{profile.targetLang}</span> from <span className="font-semibold text-sky-700">{profile.sourceLang}</span>
                </p>
            </div>
            
             <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Overall Progress</h3>
                <ProgressBar value={isNaN(overallProgress) ? 0 : overallProgress} />
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-6">Completed Lessons</h3>
                {profile.progress.length > 0 ? (
                    <ul className="space-y-4">
                        {profile.progress.map((item: UserProgressItem) => (
                            <li key={item.lessonId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800">{item.lessonTitle}</p>
                                    <p className={`text-sm ${item.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                        {item.completed ? 'Completed' : 'Not Started'}
                                    </p>
                                </div>
                                {item.completed && (
                                    <p className="font-bold text-lg text-sky-600">{item.score}%</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You haven't completed any lessons yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileScreen;