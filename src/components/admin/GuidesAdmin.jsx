import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function GuidesAdmin({ onDataChanged }) {
    const [guides, setGuides] = useState([]);
    const [form, setForm] = useState({
        name: "",
        language: "",
        experienceYears: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadGuides();
    }, []);

    async function loadGuides() {
        try {
            const data = await api.getGuides();
            setGuides(data);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            name: form.name,
            language: form.language,
            experienceYears: Number(form.experienceYears),
        };

        try {
            if (editingId) {
                await api.updateGuide(editingId, payload);
            } else {
                await api.createGuide(payload);
            }

            setForm({ name: "", language: "", experienceYears: "" });
            setEditingId(null);
            await loadGuides();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(guide) {
        setEditingId(guide.id);
        setForm({
            name: guide.name,
            language: guide.language,
            experienceYears: guide.experienceYears,
        });
    }

    async function handleDelete(id) {
        try {
            await api.deleteGuide(id);
            await loadGuides();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section className="admin-section">
            <h2>Guides management</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Guide name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Language"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Experience years"
                    value={form.experienceYears}
                    onChange={(e) =>
                        setForm({ ...form, experienceYears: e.target.value })
                    }
                />
                <button className="primary-btn" type="submit">
                    {editingId ? "Update guide" : "Add guide"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {guides.map((guide) => (
                    <div key={guide.id} className="admin-card">
                        <div>
                            <strong>{guide.name}</strong> — {guide.language}, {guide.experienceYears} years
                        </div>
                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(guide)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(guide.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}