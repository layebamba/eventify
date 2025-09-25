import React, { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            alert('Merci pour votre inscription !');
            setEmail('');
        }
    };

    return (
        <footer className="bg-white text-black">
            <div className="bg-red-500 py-6">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Ne manquez aucun événement !</h3>
                    <p className="text-blue-100 mb-6">
                        Inscrivez-vous à notre newsletter et découvrez les meilleurs événements à Dakar
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre email"
                            required
                            className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                        >
                            S'inscrire
                        </button>
                    </form>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-yellow-400">Eventify</h3>
                        <p className="text-black mb-3 text-sm">
                            La plateforme de référence pour découvrir, créer et gérer des événements au Sénégal.
                            Connectons les passionnés d'événements !
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2">
                                <span className="text-yellow-400">📍</span>
                                Dakar, Sénégal
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-green-400">📧</span>
                                contact@eventify.sn
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-blue-400">📞</span>
                                +221 XX XXX XX XX
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">Participants</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => window.location.href = "/events"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    🎪 Découvrir les événements
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/categories"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    🏷️ Parcourir par catégorie
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/calendar"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📅 Calendrier des événements
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/my-tickets"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    🎟️ Mes billets
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/favorites"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    ❤️ Mes favoris
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">Organisateurs</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => window.location.href = "/create-event"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    ➕ Créer un événement
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📊 Tableau de bord
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/manage-events"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    ⚙️ Gérer mes événements
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/analytics"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📈 Statistiques
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/promote"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📢 Promouvoir mes événements
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">Support & Aide</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => window.location.href = "/help"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    ❓ Centre d'aide
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/contact"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📞 Nous contacter
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/faq"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    💬 Questions fréquentes
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/terms"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    📋 Conditions d'utilisation
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.href = "/privacy"}
                                    className="text-black hover:text-yellow-400 transition-colors"
                                >
                                    🔒 Politique de confidentialité
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-600 mt-6 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-black">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <p>© 2024 Eventify. Tous droits réservés.</p>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    🇸🇳 Made in Senegal
                                </span>
                                <span className="flex items-center gap-1">
                                    🔒 Paiements sécurisés
                                </span>
                                <span className="flex items-center gap-1">
                                    ⚡ Support 24/7
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Développé avec</span>
                            <span className="text-red-500 animate-pulse">❤️</span>
                            <span>à Dakar</span>
                        </div>
                    </div>
                    <div className="text-center mt-3 text-xs text-gray-500">
                        Version 2.1.0 • Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110 z-50"
                title="Retour en haut"
            >
                ⬆️
            </button>
        </footer>
    );
};

export default Footer;