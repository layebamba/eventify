import { useState } from "react";
export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "participant"
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Inscription réussie !");
                setFormData({
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    role: ""
                });
                window.location.href = "/login";
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Inscription</h2>
                <input name="firstName" placeholder="Prénom" onChange={handleChange} value={formData.firstName} className="w-full p-2 mb-2 border rounded" />
                <input name="lastName" placeholder="Nom" onChange={handleChange} value={formData.lastName} className="w-full p-2 mb-2 border rounded" />
                <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
                <input name="password" placeholder="Mot de passe" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
                <select name="role" onChange={handleChange}  value={formData.role} className="w-full p-2 mb-4 border rounded">
                    <option value="participant">Participant</option>
                    <option value="organisateur">Organisateur</option>
                </select>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">S'inscrire</button>
            </form>
        </div>
    );
}