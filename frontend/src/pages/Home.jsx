import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from '../assets/Eventify.png'

export default function Home() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(6);

    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/events")
            .then((res) => res.json())
            .then((resData) => {
                console.log("Data reçue:", resData);
                setEvents(resData.data);
                setFilteredEvents(resData.data);
            })
            .catch((err) => console.error("Erreur fetch:", err));
        fetch("http://localhost:5000/api/v1/categories")
            .then((res) => res.json())
            .then((resData) => {
                console.log("Catégories reçues:", resData);
                setCategories(resData.data || []);
            })
            .catch((err) => console.error("Erreur catégories:", err));
    }, []);

    // Configuration de l'icône des marqueurs
    const eventIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const getMapCenter = () => {
        if (events.length === 0) return [14.68619, -17.46427]; // Dakar par défaut

        const validEvents = events.filter(event => event.latitude && event.longitude);
        if (validEvents.length === 0) return [14.68619, -17.46427];

        const avgLat = validEvents.reduce((sum, event) => sum + parseFloat(event.latitude), 0) / validEvents.length;
        const avgLng = validEvents.reduce((sum, event) => sum + parseFloat(event.longitude), 0) / validEvents.length;

        return [avgLat, avgLng];
    };
    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Développement économique et social': '📈',
            'Musique': '🎵',
            'Sport': '⚽',
            'Culture': '🎭',
            'Business': '💼',
            'Education': '📚',
            'Gastronomie': '🍽️',
            'Technologie': '💻',
            'Art': '🎨',
            'Santé': '💪',
            'Voyage': '✈️',
            'Communauté': '🤝',
            'Famille': '👨‍👩‍👧‍👦',
            'Mode': '👗',
            'Cinéma': '🎬'
        };
        return icons[categoryName] || '📅';
    };
    const getRandomColor = (index) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
        ];
        return colors[index % colors.length];
    };
    const nextCategories = () => {
        setCurrentCategoryIndex(prev =>
            prev + 5 >= categories.length ? 0 : prev + 5
        );
    };

    const prevCategories = () => {
        setCurrentCategoryIndex(prev =>
            prev - 5 < 0 ? Math.max(0, categories.length - 5) : prev - 5
        );
    };
    const handleSearch = () => {
        setCurrentPage(1);
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
    //pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md mb-6 p-2">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

                    <img
                        src={logo}
                        alt="Eventify"
                        className="h-20 w-72 md:h-20 md:w-56 object-contain cursor-pointer"
                        onClick={() => window.location.href = "/"}
                    />
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Rechercher des événements..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Recherche en temps réel
                                if (e.target.value.trim() === "") {
                                    setFilteredEvents(events);
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
                    {/* Menu de navigation */}
                    <nav className="flex flex-wrap gap-2 md:gap-4">
                        <button
                            onClick={() => window.location.href = "/"}
                            className="px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors"
                        >
                            🏠 Accueil
                        </button>

                        <button
                            onClick={() => window.location.href = "/dashboard"}
                            className="px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-md transition-colors"
                        >
                            📊 Dashboard
                        </button>

                        {/* Séparateur visuel */}
                        <div className="hidden md:block w-px bg-gray-300 mx-2"></div>

                        <button
                            onClick={() => window.location.href = "/login"}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            🔑 Connexion
                        </button>

                        <button
                            onClick={() => window.location.href = "/register"}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            📝 Inscription
                        </button>
                    </nav>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevCategories}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                    >
                        ←
                    </button>

                    <div className="flex-1 grid grid-cols-5 gap-4 mx-4">
                        {categories.slice(currentCategoryIndex, currentCategoryIndex + 5).map((category, index) => (
                            <div key={category.id} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white text-xl shadow-md ${getRandomColor(currentCategoryIndex + index)}`}>
                                    {getCategoryIcon(category.name)}
                                </div>
                                <p className="text-xs text-gray-700 font-medium line-clamp-2">
                                    {category.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={nextCategories}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                    >
                        →
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Événements</h1>
            </div>
            {/* Liste des événements */}
            <div className="mb-8">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        📋 Liste des événements ({events.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEvents.length > 0 ? (
                        currentEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                {/* Image */}
                                <div className="h-48 bg-gray-200">
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-4xl">📷</span>
                                        </div>
                                    )}
                                </div>

                                {/* Contenu */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 text-left">
                                        {event.title}
                                    </h2>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center">
                                            📅 {new Date(event.eventDate).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        </p>
                                        <p className="flex items-center">
                                            📍 {event.location}
                                        </p>
                                    </div>

                                    {/* Bouton Détail */}
                                    <button
                                        onClick={() => window.location.href = `/event/${event.id}`}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Voir les détails
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (

                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">
                                {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Aucun événement pour le moment."}
                            </p>
                            <p className="text-gray-500">Aucun événement pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                        {/* Bouton Précédent */}
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>

                        {/* Numéros de pages */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-2 border rounded-md ${
                                    currentPage === number
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {number}
                            </button>
                        ))}

                        {/* Bouton Suivant */}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
            {/* Carte des événements */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        📍 Carte des événements
                    </h2>
                </div>
                <MapContainer center={getMapCenter()} zoom={10} className="h-96">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {events
                        .filter(event => event.latitude && event.longitude)
                        .map((event) => (
                            <Marker
                                key={event.id}
                                position={[parseFloat(event.latitude), parseFloat(event.longitude)]}
                                icon={eventIcon}
                            >
                                <Popup>
                                    <div className="p-2 min-w-48">
                                        {event.imageUrl && (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="w-full h-20 object-cover rounded-md mb-2"
                                            />
                                        )}
                                        <h3 className="font-bold text-gray-800 mb-1">
                                            {event.title}
                                        </h3>
                                        <div className="text-xs text-gray-600 space-y-1 mb-2">
                                            <p>📅 {new Date(event.eventDate).toLocaleDateString('fr-FR', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</p>
                                            <p>📍 {event.location}</p>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = `/event/${event.id}`}
                                            className="w-full bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700"
                                        >
                                            Voir détails
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>
            {/* Pied de page */}
            <footer className="bg-white rounded-lg shadow-md mt-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">À propos</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Plateforme de gestion et découverte d'événements à Dakar et environs.
                        </p>
                        <p className="text-xs text-gray-500">
                            📍 Dakar, Sénégal
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Liens rapides</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <button className="block hover:text-blue-600 transition-colors">
                                🏠 Accueil
                            </button>
                            <button className="block hover:text-blue-600 transition-colors">
                                📅 Mes inscriptions
                            </button>
                            <button className="block hover:text-blue-600 transition-colors">
                                ❓ Aide
                            </button>
                            <button className="block hover:text-blue-600 transition-colors">
                                📞 Contact
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2024 Plateforme Événements. Tous droits réservés.</p>
                        <p className="mt-2 md:mt-0">
                            Développé avec ❤️ à Dakar
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}