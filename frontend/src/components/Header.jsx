import React, { useState, useEffect } from 'react';
import logo from '../assets/Eventify.png';

const Header = ({ events, setFilteredEvents, onSearchReset }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeMenu, setActiveMenu] = useState("");

    useEffect(() => {
        const path = window.location.pathname;
        if (path === "/") {
            setActiveMenu("home");
        } else if (path === "/dashboard") {
            setActiveMenu("dashboard");
        } else if (path === "/login") {
            setActiveMenu("login");
        } else if (path === "/register") {
            setActiveMenu("register");
        } else {
            setActiveMenu("");
        }
    }, []);

    const handleSearch = () => {
        onSearchReset?.();
        if (searchTerm.trim() === "") {
            setFilteredEvents(events);
        } else {
            const filtered = events.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEvents(filtered);
        }
    };

    const handleMenuClick = (menuName, url) => {
        setActiveMenu(menuName);
        window.location.href = url;
    };

    const getMenuClasses = (menuName) => {
        const baseClasses = "px-4 py-2 rounded-md transition-colors";
        if (activeMenu === menuName) {
            return `${baseClasses} text-yellow-500 font-semibold`;
        }
        return `${baseClasses} text-gray-700 hover:bg-yellow-100 hover:text-yellow-700`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

                <img
                    src={logo}
                    alt="Eventify"
                    className="h-20 w-72 md:h-20 md:w-56 object-contain cursor-pointer"
                    onClick={() => handleMenuClick("home", "/")}
                />

                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher des événements..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (e.target.value.trim() === "") {
                                setFilteredEvents(events);
                                onSearchReset?.();
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        🔍
                    </div>
                </div>

                <nav className="flex flex-wrap gap-2 md:gap-4">
                    <button
                        onClick={() => handleMenuClick("home", "/")}
                        className={getMenuClasses("home")}
                    >
                        🏠 Accueil
                    </button>

                    <button
                        onClick={() => handleMenuClick("dashboard", "/dashboard")}
                        className={getMenuClasses("dashboard")}
                    >
                        📊 Dashboard
                    </button>

                    <div className="hidden md:block w-px bg-gray-300 mx-2"></div>

                    <button
                        onClick={() => handleMenuClick("login", "/login")}
                        className={getMenuClasses("login")}
                    >
                        🔑 Connexion
                    </button>

                    <button
                        onClick={() => handleMenuClick("register", "/register")}
                        className={getMenuClasses("register")}
                    >
                        📝 Inscription
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Header;