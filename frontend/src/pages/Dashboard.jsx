import { useState, useEffect } from "react";
import AddEvent from "./AddEvent";

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({}); // stats par eventId

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchEvents = async () => {
        if (!token) return;
        try {
            const res = await fetch("http://localhost:5000/api/v1/events", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                const myEvents = data.data.filter(event => String(event.organizerId) === userId);
                setEvents(myEvents);
                // récupérer stats pour chaque événement
                myEvents.forEach(async (event) => {
                    const statRes = await fetch(`http://localhost:5000/api/v1/events/${event.id}/stats`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const statData = await statRes.json();
                    if (statRes.ok) {
                        setStats(prev => ({ ...prev, [event.id]: statData.totalViews }));
                    }
                });
            } else alert(data.message || "Erreur lors du chargement des événements");
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
    };

    const handleEventAdded = () => fetchEvents();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard Organisateur</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Déconnexion</button>
            </div>

            <AddEvent onEventAdded={handleEventAdded} />

            <h2 className="text-xl font-bold mb-4">Mes événements</h2>
            {loading ? <p>Chargement...</p> :
                events.length === 0 ? <p>Aucun événement créé pour le moment.</p> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map(event => (
                            <div key={event.id} className="border p-4 rounded shadow">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <p>{event.description}</p>
                                <p><strong>Lieu :</strong> {event.location}</p>
                                <p><strong>Date :</strong> {new Date(event.eventDate).toLocaleString()}</p>
                                <p><strong>Latitude :</strong> {event.latitude}</p>
                                <p><strong>Longitude :</strong> {event.longitude}</p>
                                <p><strong>Catégorie :</strong> {event.categoryName}</p>
                                <p><strong>Public :</strong> {event.isPublic ? "Oui" : "Non"}</p>
                                <p><strong>Max participants :</strong> {event.maxParticipants}</p>
                                <p><strong>Vues :</strong> {stats[event.id] || 0}</p>
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
}
