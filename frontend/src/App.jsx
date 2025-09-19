import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [backendStatus, setBackendStatus] = useState('🔄 Test en cours...')
    const [backendData, setBackendData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Test de connexion au backend au chargement
    useEffect(() => {
        const testBackend = async () => {
            try {
                console.log('🔍 Test connexion backend...')
                const response = await fetch(`${import.meta.env.VITE_API_URL}/health`)

                if (response.ok) {
                    const data = await response.json()
                    setBackendStatus('✅ Backend connecté')
                    setBackendData(data)
                    console.log('✅ Backend OK:', data)
                } else {
                    setBackendStatus('❌ Erreur de réponse')
                    console.error('❌ Response error:', response.status)
                }
            } catch (error) {
                setBackendStatus('❌ Backend inaccessible')
                console.error('❌ Connexion error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        testBackend()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-soft">
                <div className="container-main py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gradient">
                            🎉 Eventify
                        </h1>
                        <div className="flex items-center space-x-4">
              <span className="badge badge-primary">
                React + Vite + Tailwind
              </span>
                            <span className={`badge ${
                                backendStatus.includes('✅')
                                    ? 'badge-success'
                                    : backendStatus.includes('🔄')
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'badge-danger'
                            }`}>
                {backendStatus}
              </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="container-main py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Plateforme de Gestion d'Événements
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Créez, gérez et participez aux meilleurs événements près de chez vous avec une interface moderne et intuitive
                    </p>
                </div>

                {/* Grille de fonctionnalités */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="card card-hover">
                        <div className="card-body text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold mb-2">Créer des Événements</h3>
                            <p className="text-gray-600">
                                Organisez vos événements en quelques clics avec notre interface intuitive et moderne
                            </p>
                        </div>
                    </div>

                    <div className="card card-hover">
                        <div className="card-body text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-2">Gérer les Participants</h3>
                            <p className="text-gray-600">
                                Suivez les inscriptions, gérez vos participants et exportez les données facilement
                            </p>
                        </div>
                    </div>

                    <div className="card card-hover">
                        <div className="card-body text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Analytics Avancés</h3>
                            <p className="text-gray-600">
                                Analysez la performance de vos événements avec des statistiques détaillées
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status de la stack technique */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="text-2xl mr-2">⚛️</span>
                                Frontend Stack
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">React 18</span>
                                    <span className="badge badge-success">✅ Actif</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Vite (Build Tool)</span>
                                    <span className="badge badge-success">✅ Ultra-rapide</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Tailwind CSS v3</span>
                                    <span className="badge badge-success">✅ Configuré</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Hot Module Replacement</span>
                                    <span className="badge badge-success">✅ Instantané</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="text-2xl mr-2">🗄️</span>
                                Backend Stack
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Node.js + Express</span>
                                    <span className={`badge ${backendStatus.includes('✅') ? 'badge-success' : 'badge-danger'}`}>
                    {backendStatus.includes('✅') ? '✅ Connecté' : '❌ Déconnecté'}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">PostgreSQL</span>
                                    <span className={`badge ${backendStatus.includes('✅') ? 'badge-success' : 'badge-danger'}`}>
                    {backendStatus.includes('✅') ? '✅ Connecté' : '❌ Déconnecté'}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">API REST</span>
                                    <span className={`badge ${backendStatus.includes('✅') ? 'badge-success' : 'badge-danger'}`}>
                    {backendStatus.includes('✅') ? '✅ Fonctionnel' : '❌ Indisponible'}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Port 5000</span>
                                    <span className="badge badge-secondary">Localhost</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test de connexion détaillé */}
                <div className="max-w-3xl mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-2xl font-semibold mb-6 text-center">
                                🔗 Test de Connexion Full-Stack
                            </h3>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Test de connexion en cours...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">Statut Global:</span>
                                            <span className={`font-semibold text-lg ${
                                                backendStatus.includes('✅') ? 'text-green-600' : 'text-red-600'
                                            }`}>
                        {backendStatus}
                      </span>
                                        </div>
                                    </div>

                                    {backendData ? (
                                        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                                                <span className="text-2xl mr-2">✅</span>
                                                Communication Frontend ↔ Backend Établie !
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                                                <div className="space-y-2">
                                                    <div>
                                                        <strong>Message:</strong>
                                                        <p className="text-xs bg-green-100 p-2 rounded mt-1">{backendData.message}</p>
                                                    </div>
                                                    <div>
                                                        <strong>Statut API:</strong>
                                                        <p className="text-xs">{backendData.status}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <strong>Uptime Serveur:</strong>
                                                        <p className="text-xs">{Math.floor(backendData.uptime)} secondes</p>
                                                    </div>
                                                    <div>
                                                        <strong>Timestamp:</strong>
                                                        <p className="text-xs">{new Date(backendData.timestamp).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                                            <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                                                <span className="text-2xl mr-2">❌</span>
                                                Problème de Connexion Backend
                                            </h4>
                                            <div className="text-sm text-red-700 space-y-2">
                                                <p>Le backend Node.js n'est pas accessible. Vérifiez que :</p>
                                                <ul className="list-disc list-inside ml-4 space-y-1">
                                                    <li>Le serveur backend tourne sur le port 5000</li>
                                                    <li>PostgreSQL est démarré</li>
                                                    <li>Aucun firewall ne bloque la connexion</li>
                                                </ul>
                                                <div className="mt-3 p-3 bg-red-100 rounded">
                                                    <strong>Commande à exécuter :</strong>
                                                    <code className="block mt-1 text-xs">cd backend && npm run dev</code>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-center space-x-4">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => window.location.reload()}
                                        >
                                            🔄 Retester la connexion
                                        </button>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL}/health`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                        >
                                            🔗 Accéder à l'API directement
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section succès si tout fonctionne */}
                {backendStatus.includes('✅') && (
                    <div className="mt-12">
                        <div className="card max-w-5xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                            <div className="card-body text-center">
                                <h3 className="text-3xl font-bold text-green-800 mb-4">
                                    🎉 Stack Full-Stack Eventify Opérationnelle !
                                </h3>
                                <p className="text-green-700 mb-6">
                                    Félicitations ! Votre environnement de développement est prêt pour créer l'application Eventify.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="text-left">
                                        <h4 className="font-semibold mb-3 text-green-800">✅ Frontend Prêt :</h4>
                                        <ul className="text-sm text-green-700 space-y-1">
                                            <li>• React 18 + Vite configuré</li>
                                            <li>• Tailwind CSS opérationnel</li>
                                            <li>• Hot reload ultra-rapide</li>
                                            <li>• Communication API établie</li>
                                        </ul>
                                    </div>

                                    <div className="text-left">
                                        <h4 className="font-semibold mb-3 text-green-800">✅ Backend Prêt :</h4>
                                        <ul className="text-sm text-green-700 space-y-1">
                                            <li>• Node.js + Express fonctionnel</li>
                                            <li>• PostgreSQL connecté</li>
                                            <li>• API REST disponible</li>
                                            <li>• Routes de base configurées</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-white border border-green-200 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">🚀 Prochaines étapes :</h4>
                                    <p className="text-sm text-gray-600">
                                        Modèles de données → Authentification → Pages React → CRUD événements → Upload d'images
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="container-main py-8">
                    <div className="text-center text-gray-600">
                        <p className="flex items-center justify-center space-x-2">
                            <span>🎉</span>
                            <span>Eventify - Plateforme de gestion d'événements</span>
                        </p>
                        <p className="text-sm mt-2">
                            Stack: React + Vite + Tailwind CSS + Node.js + Express + PostgreSQL
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App