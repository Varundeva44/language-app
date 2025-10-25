import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiRegister } from '../services/api';

const LANGUAGES = ["Hindi", "Bengali", "Odia", "Kannada", "Telugu", "Marathi"];

const RegisterScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [sourceLang, setSourceLang] = useState('Hindi');
    const [targetLang, setTargetLang] = useState('Kannada');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }
        if (sourceLang === targetLang) {
            setError("Source and Target languages cannot be the same.");
            return;
        }
        setLoading(true);

        // Auto-generate credentials for a seamless experience
        const phoneOrEmail = `guest_${Date.now()}@setu.learn`;
        
        try {
            // Fix: Removed 'password' as it's not an expected property
            // Fix: Cast data to 'any' to handle potential error property in the response
            const data: any = await apiRegister({ name, phoneOrEmail, sourceLang, targetLang });
            if (data.token && data.user) {
                login(data.token, data.user);
                navigate('/home');
            } else {
                setError(data.error || 'Setup failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-sky-700">Welcome to SETU Learn</h1>
                    <p className="mt-2 text-gray-600">Tell us a bit about yourself to get started.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField label="What should we call you?" type="text" value={name} onChange={setName} required />
                    <LanguageSelect label="Your Language (I speak...)" value={sourceLang} onChange={setSourceLang} />
                    <LanguageSelect label="City Language (I want to learn...)" value={targetLang} onChange={setTargetLang} />

                    {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 text-lg font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 transition-colors">
                        {loading ? 'Setting up...' : 'Start Learning'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper components for form fields
const InputField: React.FC<{ label: string, type: string, value: string, onChange: (val: string) => void, required?: boolean }> = ({ label, type, value, onChange, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
        />
    </div>
);

const LanguageSelect: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white">
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
    </div>
);

export default RegisterScreen;