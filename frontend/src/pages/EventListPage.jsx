import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye,FaCalendarAlt, FaUserPlus, FaUnlock, FaLock } from "react-icons/fa";

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({});
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        dateFrom: '',
        dateTo: ''
    });
    const [organizerStats, setOrganizerStats] = useState(null);
    const filteredEvents = events.filter(event => {
        // Filtre catégorie
        if (filters.category && event.category?.name !== filters.category) {
            return false;
        }
        // Filtre lieu
        if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }

        // Filtre date
        if (filters.dateFrom && new Date(event.eventDate) < new Date(filters.dateFrom)) {
            return false;
        }
        if (filters.dateTo && new Date(event.eventDate) > new Date(filters.dateTo)) {
            return false;
        }

        return true;
    });

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const fetchOrganizerStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/v1/events/organizer/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrganizerStats(res.data);
            const data = res.data;
            const totalRegistrations = data.stats.reduce((sum, ev) => sum + ev.registrations, 0);
            const totalViews = data.stats.reduce((sum, ev) => sum + ev.views, 0);

            const publicEvents = data.stats.filter(ev => ev.isPublic).length;
            const privateEvents = data.stats.filter(ev => !ev.isPublic).length;

            setOrganizerStats({
                ...data,
                totalRegistrations,
                totalViews,
                publicEvents,
                privateEvents
            });
        } catch (err) {
            console.error("Erreur lors du chargement des stats :", err);
        }
    };
    const fetchCategories = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data.data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    };
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/v1/events/organizer/my-events",
            {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const eventsData = res.data.data || [];
            setEvents(res.data.data || []);
            const statsData = await Promise.all(eventsData.map(async (event) => {
                const statRes = await axios.get(`http://localhost:5000/api/v1/events/${event.id}/stats`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                return statRes.data;
            }));

            const statsObj = {};
            eventsData.forEach((event, index) => {
                statsObj[event.id] = {
                    views: statsData[index].totalViews,
                    registrations: statsData[index].totalRegistrations
                };
            });

            setStats(statsObj);
        } catch (error) {
            console.error("Erreur lors du chargement des événements :", error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchCategories();
        fetchOrganizerStats();

    }, []);
    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
            axios
                .delete(`http://localhost:5000/api/v1/events/${id}`)
                .then(() => fetchEvents())
                .catch((err) => console.error("Erreur suppression :", err));
        }
    };

    const handleEdit = (id) => {
        navigate(`/events/edit/${id}`);
    };

    const handleDetails = (id) => {
        navigate(`/events/${id}`);
    };
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            location: '',
            dateFrom: '',
            dateTo: ''
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Liste des événements</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Filtres</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lieu
                        </label>
                        <input
                            type="text"
                            placeholder="Rechercher par lieu..."
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            À partir du
                        </label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jusqu'au
                        </label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        {filteredEvents.length} événement(s) sur {events.length}
                    </span>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>
            <div className="flex justify-end mb-4 gap-2">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Retour à l'accueil
                </button>
            </div>

            <table className="w-full border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Titre</th>
                    <th className="border p-2">Lieu</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Participants max</th>
                    <th className="border p-2">Catégorie</th>
                    <th className="border p-2">Vues</th>
                    <th className="border p-2">Inscriptions</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredEvents.length > 0 ? (
                    paginatedEvents.map((ev) => (
                        <tr key={ev.id}>
                            <td className="border p-2">{ev.title}</td>
                            <td className="border p-2">{ev.location}</td>
                            <td className="border p-2">{new Date(ev.eventDate).toLocaleString()}</td>
                            <td className="border p-2">{ev.maxParticipants}</td>
                            <td className="border p-2">{ev.category?.name}</td>
                            <td className="border p-2">{stats[ev.id]?.views || 0}</td>
                            <td className="border p-2">{stats[ev.id]?.registrations || 0}</td>
                            <td className="border p-2">
                                <div className="flex justify-center items-center space-x-2">
                                    <FaEdit
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => handleEdit(ev.id)}
                                    />
                                    <FaTrash
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => handleDelete(ev.id)}
                                    />
                                    <FaEye
                                        className="text-green-500 cursor-pointer"
                                        onClick={() => handleDetails(ev.id)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center p-2">
                            {events.length === 0
                                ? "Aucun événement trouvé"
                                : "Aucun événement ne correspond aux filtres"
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Précédent
                </button>

                <span>
    Page {currentPage} / {totalPages}
  </span>

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
            {organizerStats && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="flex items-center p-4 bg-blue-100 rounded shadow">
                        <FaCalendarAlt className="text-blue-600 text-2xl mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Total événements</p>
                            <p className="font-bold text-lg">{organizerStats.totalEvents}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-100 rounded shadow">
                        <FaUserPlus className="text-green-600 text-2xl mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Total inscriptions</p>
                            <p className="font-bold text-lg">{organizerStats.totalRegistrations}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-yellow-100 rounded shadow">
                        <FaEye className="text-yellow-600 text-2xl mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Total vues</p>
                            <p className="font-bold text-lg">{organizerStats.totalViews}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-purple-100 rounded shadow">
                        <FaUnlock className="text-purple-600 text-2xl mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Événements publics</p>
                            <p className="font-bold text-lg">{organizerStats.publicEvents}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-red-100 rounded shadow">
                        <FaLock className="text-red-600 text-2xl mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Événements privés</p>
                            <p className="font-bold text-lg">{organizerStats.privateEvents}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
