import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import TourReviews from "../components/TourReviews";
import StarRating from "../components/StarRating";

export default function TourDetailsPage() {
    const { id } = useParams();

    const [tour, setTour] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [days, setDays] = useState(1);
    const [people, setPeople] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTour();
    }, [id]);

    async function loadTour() {
        try {
            setLoading(true);
            const data = await api.getTourById(id);
            setTour(data);

            const firstImage =
                data.images?.[0]?.url ||
                data.imageUrl ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";

            setSelectedImage(firstImage);
            setError("");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const images = useMemo(() => {
        if (!tour) return [];

        const gallery = (tour.images || [])
            .map((image) => image.url)
            .filter(Boolean);

        if (gallery.length > 0) {
            return gallery;
        }

        if (tour.imageUrl) {
            return [tour.imageUrl];
        }

        return [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
        ];
    }, [tour]);

    const totalCost = useMemo(() => {
        const pricePerDay = Number(tour?.pricePerDay || 0);
        return pricePerDay * Number(days || 0) * Number(people || 0);
    }, [tour, days, people]);

    function formatRating(value) {
        const rating = Number(value || 0);
        return rating.toFixed(1);
    }

    if (loading) {
        return <p>Loading tour...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!tour) {
        return <p>Tour not found.</p>;
    }

    return (
        <section className="tour-details-page">
            <div className="tour-layout-new">
                <div className="tour-gallery-new">
                    <img
                        src={selectedImage}
                        alt={tour.title}
                        className="tour-main-image-new"
                    />

                    <div className="gallery-row-new">
                        {images.map((img, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`gallery-thumb-new ${
                                    selectedImage === img ? "gallery-thumb-active" : ""
                                }`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img} alt={`Tour ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tour-info-card-new">
                    <div>
                        <span className="tour-label-new">Premium tour</span>
                        <h1>{tour.title}</h1>
                        <p className="tour-location-new">{tour.destination}</p>
                    </div>

                    <p className="tour-description-new">
                        {tour.description || "No description yet."}
                    </p>

                    <div className="tour-details-grid-new">
                        <div>
                            <strong>Hotel</strong>
                            <span>{tour.hotelName || "Not specified"}</span>
                        </div>

                        <div>
                            <strong>Food</strong>
                            <span>{tour.foodType || "Not specified"}</span>
                        </div>

                        <div>
                            <strong>Duration</strong>
                            <span>{tour.durationDays ?? "N/A"} days</span>
                        </div>

                        <div>
                            <strong>Guide</strong>
                            <span>{tour.guide?.name || "Not specified"}</span>
                        </div>

                        <div>
                            <strong>Places</strong>
                            <span>{tour.availablePlaces ?? "N/A"}</span>
                        </div>

                        <div>
                            <strong>Rating</strong>
                            <div className="rating-block">
                                <StarRating rating={tour.rating || 0} />
                                <span className="rating-number">
                  {formatRating(tour.rating)}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="price-block-new">
                        <div>
                            <span className="price-label-new">Full price</span>
                            <strong className="price-value-new">${tour.price ?? 0}</strong>
                        </div>

                        <div>
                            <span className="price-label-new">Price per day</span>
                            <strong className="price-secondary-new">
                                ${tour.pricePerDay ?? 0}
                            </strong>
                        </div>
                    </div>

                    <button type="button" className="primary-btn full-btn">
                        Book this tour
                    </button>
                </div>
            </div>

            <div className="calculator-card-new">
                <div className="calculator-header-new">
                    <div>
                        <h2>Cost calculator</h2>
                        <p>Estimate the final trip price by days and people.</p>
                    </div>
                </div>

                <div className="calc-grid-new">
                    <label>
                        Days
                        <input
                            type="number"
                            min="1"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                        />
                    </label>

                    <label>
                        People
                        <input
                            type="number"
                            min="1"
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                        />
                    </label>
                </div>

                <div className="calc-result-new">
                    <span>Total cost</span>
                    <strong>${totalCost.toFixed(2)}</strong>
                </div>
            </div>

            <TourReviews tourId={tour.id} />
        </section>
    );
}