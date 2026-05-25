import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function BookingsAdmin({ refreshKey, onDataChanged }) {
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        tourId: "",
        customerId: "",
        bookingDate: "",
        numberOfPeople: "",
    });

    useEffect(() => {
        loadData();
    }, [refreshKey]);

    async function loadData() {
        try {
            const [bookingsData, toursData, customersData] = await Promise.all([
                api.getBookings(),
                api.getTours(),
                api.getCustomers(),
            ]);

            setBookings(bookingsData);
            setTours(toursData);
            setCustomers(customersData);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            tourId: Number(form.tourId),
            customerId: Number(form.customerId),
            bookingDate: form.bookingDate,
            numberOfPeople: Number(form.numberOfPeople),
        };

        try {
            if (editingId) {
                await api.updateBooking(editingId, payload);
            } else {
                await api.createBooking(payload);
            }

            setEditingId(null);
            setForm({
                tourId: "",
                customerId: "",
                bookingDate: "",
                numberOfPeople: "",
            });
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(booking) {
        setEditingId(booking.id);
        setForm({
            tourId: booking.tour?.id || "",
            customerId: booking.customer?.id || "",
            bookingDate: booking.bookingDate || "",
            numberOfPeople: booking.numberOfPeople || "",
        });
    }

    async function handleDelete(id) {
        try {
            await api.deleteBooking(id);
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
            <h2>Bookings management</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
                <select
                    value={form.tourId}
                    onChange={(e) => setForm({ ...form, tourId: e.target.value })}
                >
                    <option value="">Select tour</option>
                    {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                            {tour.title}
                        </option>
                    ))}
                </select>

                <select
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={form.bookingDate}
                    onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="People"
                    value={form.numberOfPeople}
                    onChange={(e) =>
                        setForm({ ...form, numberOfPeople: e.target.value })
                    }
                />

                <button className="primary-btn" type="submit">
                    {editingId ? "Update booking" : "Add booking"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {bookings.map((booking) => (
                    <div key={booking.id} className="admin-card">
                        <div>
                            <strong>Booking #{booking.id}</strong> — {booking.tour?.title} | {booking.customer?.name}
                        </div>
                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(booking)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(booking.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}