import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function SearchControl({ setForm }) {
    const map = useMapEvents({});
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

export default function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(null);
    const [categories, setCategories] = useState([]);

    // Récupérer catégories
    useEffect(() => {
        axios.get("http://localhost:5000/api/v1/categories")
            .then(res => setCategories(res.data.data || []))
            .catch(err => console.error(err));
    }, []);

    // Récupérer événement par ID
    useEffect(() => {
        axios.get(`http://localhost:5000/api/v1/events/${id}`)
            .then(res => {
                const data = res.data.data;
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    location: data.location || "",
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    eventDate: data.eventDate ? data.eventDate.slice(0,16) : "", // pour datetime-local
                    isPublic: data.isPublic ?? true,
                    maxParticipants: data.maxParticipants || "",
                    categoryName: data.categoryName || "",
                });
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!form) return <p>Chargement...</p>;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            if (fileInputRef.current?.files[0]) formData.append("image", fileInputRef.current.files[0]);
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/v1/events/${id}`, formData, {
                headers: {  "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` }
            });
            alert("Événement mis à jour !");
            navigate("/events");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Modifier l'événement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Titre" />
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
                <input name="location" value={form.location} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Lieu" />

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="latitude" value={form.latitude || ""} readOnly className="w-full p-2 border rounded" />
                    <input type="text" name="longitude" value={form.longitude || ""} readOnly className="w-full p-2 border rounded" />
                </div>

                <MapContainer center={[form.latitude || 14.6928, form.longitude || -17.4467]} zoom={13} style={{ height: "300px", width: "100%" }} doubleClickZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    <SearchControl setForm={setForm} />
                    <LocationMarker form={form} setForm={setForm} />
                </MapContainer>

                <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Nombre max de participants" />

                <select name="categoryName" value={form.categoryName} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>

                <input type="file" ref={fileInputRef} className="w-full p-2 border rounded" />
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
                    <span>Événement public</span>
                </label>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Mettre à jour</button>
            </form>
        </div>
    );
}
