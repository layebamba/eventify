import { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            const res = await fetch("http://localhost:5000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);
                setSuccessMessage("Connexion réussie ! Redirection en cours...");
                if (data.user.role === "organisateur") {
                    window.location.href = "/dashboard";
                } else if (data.user.role === "participant") {
                    window.location.href = "/";
                }
                else {
                    window.location.href = "/dashboard";
                }
            } else {
                if (res.status === 401) {
                    setErrors({ general: "Email ou mot de passe incorrect" });
                } else if (data.errors && Array.isArray(data.errors)) {
                    const fieldErrors = {};
                    data.errors.forEach(error => {
                        if (error.path) {
                            fieldErrors[error.path] = error.message;
                        }
                    });
                    setErrors(fieldErrors);
                } else {
                    setErrors({ general: data.message || "Erreur lors de la connexion" });
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
                <h2 className="text-xl text-green-600 font-bold mb-4">Connexion</h2>
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
                        name="email"
                        type="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                        className={`w-full p-2 hover:border-amber-300 border rounded transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            className={`w-full p-2 pr-12 hover:border-amber-300 border rounded transition-colors ${
                                errors.password ? 'border-red-500 bg-red-50' : ''
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800 transition-colors"
                            title={showPassword ? "Masquer le mot de passe" : "Voir le mot de passe"}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-2 rounded font-medium transition-colors ${
                        isLoading
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-green-600 hover:bg-yellow-500 text-white'
                    }`}
                >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Pas de compte ? {" "}
                        <button
                            type="button"
                            onClick={() => window.location.href = "/register"}
                            className="text-green-600 hover:text-green-800 underline"
                        >
                            Inscrivez-vous ici
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
