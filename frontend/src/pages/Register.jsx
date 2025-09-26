import { useState } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "participant"
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setSuccessMessage("");
        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                setSuccessMessage("Inscription réussie ! Redirection en cours...");
                setFormData({
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    role: ""
                });
                window.location.href = "/login";
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    const fieldErrors = {};
                    data.errors.forEach(error => {
                        if (error.path) {
                            fieldErrors[error.path] = error.message;
                        }
                    });
                    setErrors(fieldErrors);
                } else {
                    setErrors({ general: data.message || "Erreur lors de l'inscription" });
                }
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: "Erreur de connexion. Vérifiez votre connexion internet." });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
                <h2 className="text-xl text-green-600 font-bold mb-4">Inscrivez-vous maintenant</h2>
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <div className="mb-3">
                    <input
                        name="firstName"
                        placeholder="Prénom"
                        onChange={handleChange}
                        value={formData.firstName}
                        className={`w-full hover:border-amber-300 p-2 border rounded transition-colors ${
                            errors.firstName ? 'border-red-500 bg-red-50' : ''
                        }`}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div className="mb-3">
                    <input
                        name="lastName"
                        placeholder="Nom"
                        onChange={handleChange}
                        value={formData.lastName}
                        className={`w-full hover:border-amber-300 p-2 border rounded transition-colors ${
                            errors.lastName ? 'border-red-500 bg-red-50' : ''
                        }`}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div className="mb-3">
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full hover:border-amber-300 p-2 border rounded transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-3">
                    <div className="relative">
                        <input
                            name="password"
                            placeholder="Mot de passe"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-2 pr-10 hover:border-amber-300 border rounded transition-colors ${
                                errors.password ? 'border-red-500 bg-red-50' : ''
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <select name="role" onChange={handleChange}  value={formData.role} className="w-full hover:border-amber-300 p-2 mb-4 border rounded">
                    <option value="participant">Participant</option>
                    <option value="organisateur">Organisateur</option>
                </select>
                <button type="submit"
                        disabled={isLoading}
                        className={`w-full p-2 rounded font-medium transition-colors ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-green-600 hover:bg-yellow-500 text-white'
                        }`}
                >
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </form>
        </div>
    );
}