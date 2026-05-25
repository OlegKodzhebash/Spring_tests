import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

export default function TourReviews({ tourId }) {
    const [reviews, setReviews] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [form, setForm] = useState({
        text: "",
        rating: 5,
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [tourId]);

    async function loadData() {
        try {
            const reviewsData = await api.getReviewsByTour(tourId);
            setReviews(reviewsData);

            try {
                const me = await api.me();
                setCurrentUser(me);
            } catch {
                setCurrentUser(null);
            }

            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (!currentUser) {
                setError("You must be logged in to leave a review.");
                return;
            }

            const payload = {
                text: form.text,
                rating: Number(form.rating),
                tourId: Number(tourId),
            };

            if (editingId) {
                await api.updateReview(editingId, payload);
            } else {
                await api.createReview(payload);
            }

            resetForm();
            await loadData();
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(review) {
        if (!currentUser || review.user?.id !== currentUser.id) {
            setError("You can edit only your own review.");
            return;
        }

        setEditingId(review.id);
        setForm({
            text: review.text || "",
            rating: review.rating || 5,
        });
        setError("");
    }

    async function handleDelete(review) {
        if (!currentUser || review.user?.id !== currentUser.id) {
            setError("You can delete only your own review.");
            return;
        }

        try {
            await api.deleteReview(review.id);

            if (editingId === review.id) {
                resetForm();
            }

            await loadData();
        } catch (e) {
            setError(e.message);
        }
    }

    function resetForm() {
        setForm({
            text: "",
            rating: 5,
        });
        setEditingId(null);
        setError("");
    }

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;

        const avg =
            reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
            reviews.length;

        return avg.toFixed(1);
    }, [reviews]);

    function renderStars(rating) {
        const safeRating = Number(rating || 0);
        return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
    }

    return (
        <section className="reviews-section">
            <div className="reviews-header">
                <div>
                    <h2>Customer reviews</h2>

                    <p className="reviews-summary">
                        Average rating:{" "}
                        <strong>{reviews.length > 0 ? `${averageRating} / 5` : "No rating yet"}</strong>
                    </p>

                    <p className="reviews-user-info">
                        {currentUser
                            ? `Logged in as ${currentUser.login}, phone: ${currentUser.phone}`
                            : "Login or register to leave a review."}
                    </p>
                </div>

                {editingId && (
                    <button type="button" className="secondary-btn" onClick={resetForm}>
                        Cancel editing
                    </button>
                )}
            </div>

            {currentUser && (
                <form className="review-form" onSubmit={handleSubmit}>
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
                        placeholder="Write your review..."
                        value={form.text}
                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                    />

                    <button className="primary-btn" type="submit">
                        {editingId ? "Update review" : "Add review"}
                    </button>
                </form>
            )}

            {error && <p className="error">{error}</p>}

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const isOwner = currentUser && review.user?.id === currentUser.id;

                        return (
                            <div key={review.id} className="review-card">
                                <div className="review-top">
                                    <div>
                                        <strong>{review.user?.login || "User"}</strong>
                                        <div className="review-stars">{renderStars(review.rating)}</div>
                                    </div>

                                    <span>{review.rating} / 5</span>
                                </div>

                                <p>{review.text}</p>

                                <div className="review-bottom">
                                    <small>{review.createdAt}</small>

                                    {isOwner && (
                                        <div className="actions">
                                            <button
                                                type="button"
                                                className="secondary-btn"
                                                onClick={() => handleEdit(review)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="danger-btn"
                                                onClick={() => handleDelete(review)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </section>
    );
}