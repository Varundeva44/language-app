import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import RegisterScreen from './pages/RegisterScreen';
import HomeScreen from './pages/HomeScreen';
import LessonScreen from './pages/LessonScreen';
import QuizScreen from './pages/QuizScreen';
import ProfileScreen from './pages/ProfileScreen';
import ResultScreen from './pages/ResultScreen';
import Header from './components/Header';

const AppRoutes: React.FC = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {auth.token && <Header />}
            <main className="p-4 sm:p-6 md:p-8">
                <Routes>
                    {auth.token ? (
                        <>
                            <Route path="/home" element={<HomeScreen />} />
                            <Route path="/lesson/:lessonId" element={<LessonScreen />} />
                            <Route path="/quiz/:lessonId" element={<QuizScreen />} />
                            <Route path="/results/:lessonId" element={<ResultScreen />} />
                            <Route path="/profile" element={<ProfileScreen />} />
                            <Route path="*" element={<Navigate to="/home" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/setup" element={<RegisterScreen />} />
                            <Route path="*" element={<Navigate to="/setup" />} />
                        </>
                    )}
                </Routes>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    );
};

export default App;