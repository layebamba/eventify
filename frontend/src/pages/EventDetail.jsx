import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetail() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL /event/:id
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isParticipating, setIsParticipating] = useState(false);
    const [alreadyParticipating, setAlreadyParticipating] = useState(false);
    const [participationMessage, setParticipationMessage] = useState("");

    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                setLoading(true);

                // Récupérer le token d'auth si nécessaire
                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:5000/api/v1/events/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Erreur lors du chargement");
                }

                setEvent(result.data);
                console.log("Événement chargé:", result.data);

                // Vérifier si l'utilisateur participe déjà (optionnel)
                // TODO: Ajouter une API pour vérifier la participation existante
                // checkParticipationStatus(id, token);

            } catch (error) {
                console.error("Erreur:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetail();
        }
    }, [id]);

    // Fonction pour participer à l'événement
    const handleParticipation = async () => {
        try {
            setIsParticipating(true);
            setParticipationMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:5000/api/v1/registrations`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventId: id  // Envoie l'eventId dans le body
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'inscription");
            }

            // Succès !
            setAlreadyParticipating(true);
            setParticipationMessage("✅ Participation confirmée ! Vous êtes inscrit(e) à cet événement.");

        } catch (error) {
            console.error("Erreur participation:", error);
            setParticipationMessage(`❌ ${error.message}`);
        } finally {
            setIsParticipating(false);
        }
    };

    // État de chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">❌ {error}</p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Retour aux événements
                    </button>
                </div>
            </div>
        );
    }

    // Événement non trouvé
    if (!event) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Événement non trouvé</p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Retour aux événements
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header avec bouton retour */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        ← Retour aux événements
                    </button>
                    <button
                        onClick={() => window.location.href = "/logout"}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                    {/* Image principale */}
                    <div className="h-64 md:h-96 bg-gray-200">
                        {event.imageUrl ? (
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-6xl">📷</span>
                            </div>
                        )}
                    </div>

                    {/* Informations de l'événement */}
                    <div className="p-8">
                        {/* Titre et catégorie */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
                                {event.category && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {event.category.name}
                                    </span>
                                )}
                            </div>

                            {/* Statut public/privé */}
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                event.isPublic
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                            }`}>
                                {event.isPublic ? 'Événement public' : 'Événement privé'}
                            </span>
                        </div>

                        {/* Informations principales */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Colonne gauche */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 Date et heure</h3>
                                    <p className="text-gray-600">
                                        {new Date(event.eventDate).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 Lieu</h3>
                                    <p className="text-gray-600">{event.location}</p>
                                </div>

                                {event.maxParticipants && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Participants</h3>
                                        <p className="text-gray-600">Maximum {event.maxParticipants} participants</p>
                                    </div>
                                )}
                            </div>

                            {/* Colonne droite */}
                            <div className="space-y-4">
                                {event.organizer && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">👤 Organisateur</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="font-medium text-gray-800">
                                                {event.organizer.firstName && event.organizer.lastName
                                                    ? `${event.organizer.firstName} ${event.organizer.lastName}`
                                                    : event.organizer.email}
                                            </p>
                                            {event.organizer.email && (
                                                <p className="text-gray-600 text-sm">{event.organizer.email}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Informations supplémentaires */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">ℹ️ Informations</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Créé le : {new Date(event.createdAt).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Description</h3>
                            <div className="bg-gray-50 p-6 rounded-md">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8">
                            {/* Message de participation */}
                            {participationMessage && (
                                <div className={`p-4 rounded-md mb-4 ${
                                    participationMessage.includes('✅')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {participationMessage}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.location.href = "/"}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Retour à la liste
                                </button>

                                {/* Bouton de participation */}
                                <button
                                    onClick={handleParticipation}
                                    disabled={isParticipating || alreadyParticipating}
                                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                        alreadyParticipating
                                            ? 'bg-green-500 text-white cursor-not-allowed'
                                            : isParticipating
                                                ? 'bg-blue-400 text-white cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {alreadyParticipating
                                        ? '✓ Inscrit(e)'
                                        : isParticipating
                                            ? 'Inscription...'
                                            : 'Participer à l\'événement'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}