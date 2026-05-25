import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import TourCard from "../components/TourCard";

export default function ToursPage() {
    const [tours, setTours] = useState([]);
    const [search, setSearch] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");
    const [foodFilter, setFoodFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minDays, setMinDays] = useState("");
    const [maxDays, setMaxDays] = useState("");
    const [minRating, setMinRating] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTours();
    }, []);

    async function loadTours() {
        try {
            setLoading(true);
            const data = await api.getTours();
            setTours(data);
            setError("");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const destinations = useMemo(() => {
        return [...new Set(tours.map((tour) => tour.destination).filter(Boolean))];
    }, [tours]);

    const foodTypes = useMemo(() => {
        return [...new Set(tours.map((tour) => tour.foodType).filter(Boolean))];
    }, [tours]);

    const filteredTours = useMemo(() => {
        let result = tours.filter((tour) => {
            const title = tour.title?.toLowerCase() || "";
            const description = tour.description?.toLowerCase() || "";
            const destination = tour.destination?.toLowerCase() || "";
            const query = search.toLowerCase();

            const matchesSearch =
                title.includes(query) ||
                description.includes(query) ||
                destination.includes(query);

            const matchesDestination =
                !destinationFilter || tour.destination === destinationFilter;

            const matchesFood = !foodFilter || tour.foodType === foodFilter;

            const price = Number(tour.price || 0);
            const durationDays = Number(tour.durationDays || 0);
            const rating = Number(tour.rating || 0);
            const places = Number(tour.availablePlaces || 0);

            const matchesMinPrice = !minPrice || price >= Number(minPrice);
            const matchesMaxPrice = !maxPrice || price <= Number(maxPrice);

            const matchesMinDays = !minDays || durationDays >= Number(minDays);
            const matchesMaxDays = !maxDays || durationDays <= Number(maxDays);

            const matchesRating = !minRating || rating >= Number(minRating);

            const matchesAvailability = !onlyAvailable || places > 0;

            return (
                matchesSearch &&
                matchesDestination &&
                matchesFood &&
                matchesMinPrice &&
                matchesMaxPrice &&
                matchesMinDays &&
                matchesMaxDays &&
                matchesRating &&
                matchesAvailability
            );
        });

        if (sortBy === "priceAsc") {
            result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        }

        if (sortBy === "priceDesc") {
            result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        }

        if (sortBy === "ratingDesc") {
            result = [...result].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        }

        if (sortBy === "daysAsc") {
            result = [...result].sort(
                (a, b) => Number(a.durationDays || 0) - Number(b.durationDays || 0)
            );
        }

        if (sortBy === "daysDesc") {
            result = [...result].sort(
                (a, b) => Number(b.durationDays || 0) - Number(a.durationDays || 0)
            );
        }

        return result;
    }, [
        tours,
        search,
        destinationFilter,
        foodFilter,
        minPrice,
        maxPrice,
        minDays,
        maxDays,
        minRating,
        onlyAvailable,
        sortBy,
    ]);

    function resetFilters() {
        setSearch("");
        setDestinationFilter("");
        setFoodFilter("");
        setMinPrice("");
        setMaxPrice("");
        setMinDays("");
        setMaxDays("");
        setMinRating("");
        setOnlyAvailable(false);
        setSortBy("default");
    }

    return (
        <section>
            <div className="page-header">
                <h1>Tours</h1>
                <p>Choose a tour and see details with gallery, reviews and calculator.</p>
            </div>

            <div className="tours-layout">
                <aside className="filters-sidebar">
                    <div className="filters-sidebar-header">
                        <h2>Filters</h2>
                        <button type="button" className="text-button" onClick={resetFilters}>
                            Reset
                        </button>
                    </div>

                    <div className="filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Country / destination</label>
                        <select
                            value={destinationFilter}
                            onChange={(e) => setDestinationFilter(e.target.value)}
                        >
                            <option value="">All destinations</option>
                            {destinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Food type</label>
                        <select
                            value={foodFilter}
                            onChange={(e) => setFoodFilter(e.target.value)}
                        >
                            <option value="">All food types</option>
                            {foodTypes.map((food) => (
                                <option key={food} value={food}>
                                    {food}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Price range</label>
                        <div className="filter-row">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Duration days</label>
                        <div className="filter-row">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minDays}
                                onChange={(e) => setMinDays(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxDays}
                                onChange={(e) => setMaxDays(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Minimum rating</label>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                        >
                            <option value="">Any rating</option>
                            <option value="5">5 stars</option>
                            <option value="4">4+ stars</option>
                            <option value="3">3+ stars</option>
                            <option value="2">2+ stars</option>
                            <option value="1">1+ star</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort by</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="default">Default</option>
                            <option value="priceAsc">Price: low to high</option>
                            <option value="priceDesc">Price: high to low</option>
                            <option value="ratingDesc">Rating: highest first</option>
                            <option value="daysAsc">Duration: shortest first</option>
                            <option value="daysDesc">Duration: longest first</option>
                        </select>
                    </div>

                    <label className="checkbox-filter">
                        <input
                            type="checkbox"
                            checked={onlyAvailable}
                            onChange={(e) => setOnlyAvailable(e.target.checked)}
                        />
                        Only available tours
                    </label>

                    <div className="filter-result-box">
                        <strong>{filteredTours.length}</strong>
                        <span> tours found</span>
                    </div>
                </aside>

                <div className="tours-content">
                    {loading && <p>Loading tours...</p>}
                    {error && <p className="error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <div className="tours-result-header">
                                <h2>Available Tours</h2>
                                <p>
                                    Showing {filteredTours.length} of {tours.length} tours
                                </p>
                            </div>

                            <div className="tour-grid">
                                {filteredTours.length > 0 ? (
                                    filteredTours.map((tour) => (
                                        <TourCard key={tour.id} tour={tour} />
                                    ))
                                ) : (
                                    <div className="empty-results">
                                        <h3>No tours found</h3>
                                        <p>Try changing filters or resetting them.</p>
                                        <button
                                            type="button"
                                            className="primary-btn"
                                            onClick={resetFilters}
                                        >
                                            Reset filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}