import { Link } from "react-router-dom";

export default function TourCard({ tour }) {
    const cover =
        tour.images?.[0]?.url ||
        tour.imageUrl ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";

    return (
        <article className="tour-card">
            <img src={cover} alt={tour.title} className="tour-image" />

            <div className="tour-card-content">
                <div className="tour-card-top">
                    <h3>{tour.title}</h3>
                    <span className="badge">{tour.destination}</span>
                </div>

                <p className="tour-description">
                    {tour.description || "No description yet."}
                </p>

                <div className="tour-meta">
                    <span>Hotel: {tour.hotelName || "Not specified"}</span>
                    <span>Food: {tour.foodType || "Not specified"}</span>
                    <span>Rating: {tour.rating ?? "N/A"}</span>
                    <span>Places: {tour.availablePlaces ?? "N/A"}</span>
                </div>

                <div className="tour-bottom">
                    <div>
                        <div className="tour-price">${tour.price ?? 0}</div>
                        <div className="tour-price-small">
                            ${tour.pricePerDay ?? 0} / day
                        </div>
                    </div>

                    <Link to={`/tours/${tour.id}`} className="primary-btn">
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
}