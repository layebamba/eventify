import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home.jsx";
import Logout from "./pages/Logout.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import EventListPage from "./pages/EventListPage.jsx";
import EditEventPage from "./pages/EditEventPage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout />} />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/edit/:id" element={<EditEventPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                            <p className="text-gray-600 mb-4">Page non trouvée</p>
                            <button
                                onClick={() => window.location.href = "/"}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}
export default App