import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function CustomersAdmin({ onDataChanged }) {
    const [customers, setCustomers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            const data = await api.getCustomers();
            setCustomers(data);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingId) {
                await api.updateCustomer(editingId, form);
            } else {
                await api.createCustomer(form);
            }

            setForm({ name: "", email: "", phone: "" });
            setEditingId(null);
            await loadCustomers();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(customer) {
        setEditingId(customer.id);
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
        });
    }

    async function handleDelete(id) {
        try {
            await api.deleteCustomer(id);
            await loadCustomers();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section className="admin-section">
            <h2>Customers management</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <button className="primary-btn" type="submit">
                    {editingId ? "Update customer" : "Add customer"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {customers.map((customer) => (
                    <div key={customer.id} className="admin-card">
                        <div>
                            <strong>{customer.name}</strong> — {customer.email} | {customer.phone}
                        </div>
                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(customer)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(customer.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}