import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpenIcon, UserCircleIcon } from './icons/Icons';

const Header: React.FC = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/setup');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-sky-600 text-white'
                : 'text-slate-100 hover:bg-sky-800 hover:text-white'
        }`;

    return (
        <header className="bg-sky-700 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-white tracking-tight">SETU Learn</h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLink to="/home" className={navLinkClasses}>
                            <BookOpenIcon />
                            Lessons
                        </NavLink>
                        <NavLink to="/profile" className={navLinkClasses}>
                            <UserCircleIcon />
                            Profile
                        </NavLink>
                    </nav>
                    <div className="flex items-center">
                         <span className="text-white mr-4 hidden sm:inline">
                           Welcome, {auth.user?.name}
                         </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Nav */}
            <nav className="md:hidden bg-sky-800 p-2 flex justify-around">
                <NavLink to="/home" className={navLinkClasses}><BookOpenIcon/>Lessons</NavLink>
                <NavLink to="/profile" className={navLinkClasses}><UserCircleIcon/>Profile</NavLink>
            </nav>
        </header>
    );
};

export default Header;