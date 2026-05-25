import { useState } from "react";
import { api } from "../api/api";

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [registerForm, setRegisterForm] = useState({
        login: "",
        password: "",
        phone: "",
    });

    const [loginForm, setLoginForm] = useState({
        login: "",
        password: "",
    });

    async function handleRegister(e) {
        e.preventDefault();

        try {
            const user = await api.register(registerForm);
            setMessage(`Registered and logged in as ${user.login}`);
            setError("");
        } catch (e) {
            setError(e.message);
            setMessage("");
        }
    }

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const user = await api.login(loginForm);
            setMessage(`Logged in as ${user.login}`);
            setError("");
        } catch (e) {
            setError(e.message);
            setMessage("");
        }
    }

    async function handleLogout() {
        try {
            await api.logout();
            setMessage("Logged out");
            setError("");
        } catch (e) {
            setError(e.message);
            setMessage("");
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-toggle">
                <button
                    type="button"
                    className={mode === "login" ? "primary-btn" : "secondary-btn"}
                    onClick={() => setMode("login")}
                >
                    Login
                </button>

                <button
                    type="button"
                    className={mode === "register" ? "primary-btn" : "secondary-btn"}
                    onClick={() => setMode("register")}
                >
                    Register
                </button>
            </div>

            {mode === "login" ? (
                <form className="auth-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Login"
                        value={loginForm.login}
                        onChange={(e) =>
                            setLoginForm({ ...loginForm, login: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) =>
                            setLoginForm({ ...loginForm, password: e.target.value })
                        }
                    />

                    <button className="primary-btn" type="submit">
                        Login
                    </button>
                </form>
            ) : (
                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Login"
                        value={registerForm.login}
                        onChange={(e) =>
                            setRegisterForm({ ...registerForm, login: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) =>
                            setRegisterForm({ ...registerForm, password: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Phone"
                        value={registerForm.phone}
                        onChange={(e) =>
                            setRegisterForm({ ...registerForm, phone: e.target.value })
                        }
                    />

                    <button className="primary-btn" type="submit">
                        Register
                    </button>
                </form>
            )}

            <div className="auth-actions">
                <button className="danger-btn" type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {message && <p>{message}</p>}
            {error && <p className="error">{error}</p>}
        </section>
    );
}