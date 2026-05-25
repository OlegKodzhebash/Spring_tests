import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function ReviewsAdmin({ refreshKey, onDataChanged }) {
    const [reviews, setReviews] = useState([]);
    const [tours, setTours] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        text: "",
        rating: 5,
        tourId: "",
        customerId: "",
    });

    useEffect(() => {
        loadData();
    }, [refreshKey]);

    async function loadData() {
        try {
            const [reviewsData, toursData, customersData] = await Promise.all([
                api.getReviews(),
                api.getTours(),
                api.getCustomers(),
            ]);

            setReviews(reviewsData);
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
            text: form.text,
            rating: Number(form.rating),
            tourId: Number(form.tourId),
            customerId: Number(form.customerId),
        };

        try {
            if (editingId) {
                await api.updateReview(editingId, payload);
            } else {
                await api.createReview(payload);
            }

            setEditingId(null);
            setForm({
                text: "",
                rating: 5,
                tourId: "",
                customerId: "",
            });

            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(review) {
        setEditingId(review.id);
        setForm({
            text: review.text || "",
            rating: review.rating || 5,
            tourId: review.tour?.id || "",
            customerId: review.customer?.id || "",
        });
    }

    async function handleDelete(id) {
        try {
            await api.deleteReview(id);
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function renderStars(rating) {
        const safeRating = Number(rating || 0);
        return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
    }

    return (
        <section className="admin-section">
            <h2>Reviews management</h2>

            <form className="admin-form admin-form-large" onSubmit={handleSubmit}>
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

                <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                >
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                </select>

                <textarea
                    placeholder="Review text"
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                />

                <button className="primary-btn" type="submit">
                    {editingId ? "Update review" : "Add review"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {reviews.map((review) => (
                    <div key={review.id} className="admin-card">
                        <div>
                            <strong>{review.customer?.name || "Customer"}</strong>
                            {" | "}
                            Tour: {review.tour?.title || "Tour"}
                            {" | "}
                            {renderStars(review.rating)}
                            <br />
                            {review.text}
                        </div>

                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(review)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(review.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}