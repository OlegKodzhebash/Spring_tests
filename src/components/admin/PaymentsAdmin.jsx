import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function PaymentsAdmin({ refreshKey, onDataChanged }) {
    const [payments, setPayments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        bookingId: "",
        amount: "",
        paymentDate: "",
        method: "",
    });

    useEffect(() => {
        loadData();
    }, [refreshKey]);

    async function loadData() {
        try {
            const [paymentsData, bookingsData] = await Promise.all([
                api.getPayments(),
                api.getBookings(),
            ]);

            setPayments(paymentsData);
            setBookings(bookingsData);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            bookingId: Number(form.bookingId),
            amount: Number(form.amount),
            paymentDate: form.paymentDate,
            method: form.method,
        };

        try {
            if (editingId) {
                await api.updatePayment(editingId, payload);
            } else {
                await api.createPayment(payload);
            }

            setEditingId(null);
            setForm({
                bookingId: "",
                amount: "",
                paymentDate: "",
                method: "",
            });
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(payment) {
        setEditingId(payment.id);
        setForm({
            bookingId: payment.booking?.id || "",
            amount: payment.amount || "",
            paymentDate: payment.paymentDate || "",
            method: payment.method || "",
        });
    }

    async function handleDelete(id) {
        try {
            await api.deletePayment(id);
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section className="admin-section">
            <h2>Payments management</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
                <select
                    value={form.bookingId}
                    onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                >
                    <option value="">Select booking</option>
                    {bookings.map((booking) => (
                        <option key={booking.id} value={booking.id}>
                            Booking #{booking.id}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Method"
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                />

                <button className="primary-btn" type="submit">
                    {editingId ? "Update payment" : "Add payment"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {payments.map((payment) => (
                    <div key={payment.id} className="admin-card">
                        <div>
                            <strong>Payment #{payment.id}</strong> — ${payment.amount} | {payment.method}
                        </div>
                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(payment)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(payment.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}