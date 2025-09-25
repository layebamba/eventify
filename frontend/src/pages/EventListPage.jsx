import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    // Récupérer les événements depuis l'API
    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/events");
            setEvents(res.data.data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des événements :", error);
        }
    };

    useEffect(() => {
        fetchEvents();

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

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Liste des événements</h2>

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
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.length > 0 ? (
                    events.map((ev) => (
                        <tr key={ev.id}>
                            <td className="border p-2">{ev.title}</td>
                            <td className="border p-2">{ev.location}</td>
                            <td className="border p-2">{new Date(ev.eventDate).toLocaleString()}</td>
                            <td className="border p-2">{ev.maxParticipants}</td>
                            <td className="border p-2">{ev.category?.name}</td>
                            <td className="border p-9  flex justify-between space-x-2">
                                <FaEdit
                                    className="text-blue-500 cursor-pointer "
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
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center p-2">
                            Aucun événement trouvé
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
