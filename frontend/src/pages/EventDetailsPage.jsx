import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/v1/events/${id}`)
            .then(res => setEvent(res.data.data))
            .catch(err => console.error("Erreur chargement événement:", err));
    }, [id]);

    if (!event) return <p>Chargement...</p>;
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Lieu:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
            <p><strong>Participants max:</strong> {event.maxParticipants}</p>
            <p><strong>Catégorie:</strong> {event.category?.name || 'Non spécifiée'}</p>
            {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded mt-4" />
            )}
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate(-1)}
            >
                Retour
            </button>
        </div>
    );

    }
