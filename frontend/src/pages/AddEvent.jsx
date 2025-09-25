import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import {useNavigate, useParams} from "react-router-dom";

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Recherche OSM
function SearchControl({ setForm }) {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            showMarker: true,
            showPopup: true,
            marker: { icon: new L.Icon.Default(), draggable: false },
            maxMarkers: 1,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
        });
        map.addControl(searchControl);

        map.on("geosearch/showlocation", (result) => {
            const { x, y, label } = result.location;
            setForm((prev) => ({ ...prev, latitude: y, longitude: x, location: label }));
        });

        return () => map.removeControl(searchControl);
    }, [map, setForm]);

    return null;
}

// Marker draggable et double clic
function LocationMarker({ form, setForm }) {
    const map = useMapEvents({
        dblclick(e) {
            setForm((prev) => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng }));
        },
    });

    if (!form.latitude || !form.longitude) return null;

    return (
        <Marker
            position={[form.latitude, form.longitude]}
            draggable={true}
            eventHandlers={{
                dragend(e) {
                    const { lat, lng } = e.target.getLatLng();
                    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                },
            }}
        />
    );
}

export default function AddEvent({ editMode = false }) {
    const { id } = useParams();
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        latitude: null,
        longitude: null,
        eventDate: "",
        isPublic: true,
        maxParticipants: "",
        categoryName: "",
    });

    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // Charger catégories
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/v1/categories")
            .then((res) => setCategories(res.data.data || []))
            .catch((err) => console.error("Erreur chargement catégories:", err));
    }, []);
    useEffect(() => {
        if (editMode && id) {
            axios.get(`http://localhost:5000/api/v1/events/${id}`)
                .then(res => {
                    const data = res.data.data;
                    setForm({
                        title: data.title,
                        description: data.description,
                        location: data.location,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        eventDate: data.eventDate,
                        isPublic: data.isPublic,
                        maxParticipants: data.maxParticipants,
                        categoryName: data.categoryName,
                    });
                })
                .catch(err => console.error(err));
        }
    }, [editMode, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => formData.append(key, form[key]));
            if (image) formData.append("image", image);
            const token = localStorage.getItem("token");
            if (editMode) {
                await axios.put(`http://localhost:5000/api/v1/events/${id}`, formData, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                alert("Événement mis à jour !");
            }
            else {
                await axios.post("http://localhost:5000/api/v1/events", formData, {
                    headers: { "Content-Type": "multipart/form-data" ,
                        "Authorization": `Bearer ${token}`
                    },
                });

                alert("Événement créé avec succès !");
            }
            navigate("/events");
        } catch (error) {
            console.error("Erreur création événement:", error);
            alert("Erreur lors de la création de l'événement");
        }
    };
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Retour à l'accueil
                </button>
                <button
                    onClick={() => navigate("/events")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-yellow-300"
                >
                    Voir tableau
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">{editMode ? "Modifier l'événement" : "Créer un événement"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="title"
                    placeholder="Titre"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Lieu"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="latitude" placeholder="Latitude" value={form.latitude || ""} readOnly className="w-full p-2 border rounded" />
                    <input type="text" name="longitude" placeholder="Longitude" value={form.longitude || ""} readOnly className="w-full p-2 border rounded" />
                </div>

                <MapContainer center={[14.6928, -17.4467]} zoom={13} style={{ height: "300px", width: "100%" }} doubleClickZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    <SearchControl setForm={setForm} />
                    <LocationMarker form={form} setForm={setForm} />
                </MapContainer>

                <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full p-2 border rounded" required />

                <input type="file" accept="image/*" ref={fileInputRef}  onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" />

                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
                    <span>Événement public</span>
                </label>

                <input type="number" name="maxParticipants" placeholder="Nombre max de participants" value={form.maxParticipants} onChange={handleChange} className="w-full p-2 border rounded" />

                <select name="categoryName" value={form.categoryName} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-yellow-300">
                    {editMode ? "Mettre à jour" : "Créer"}
                </button>
            </form>
        </div>
    );
}
