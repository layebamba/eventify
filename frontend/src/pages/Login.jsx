import { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Connexion réussie !");
                window.location.href = "/dashboard"; // redirection après login
            } else {
                alert(data.message || "Email ou mot de passe incorrect");
            }
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la connexion");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Connexion</h2>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Se connecter
                </button>
            </form>
        </div>
    );
}
