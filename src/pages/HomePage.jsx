import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import ScrollReveal from "../components/ScrollReveal";
import StarRating from "../components/StarRating";

export default function HomePage() {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        loadTours();
    }, []);

    async function loadTours() {
        try {
            const data = await api.getTours();
            setTours(data);
        } catch (e) {
            console.log(e.message);
        }
    }

    const featuredTours = useMemo(() => {
        const names = [
            "Serene Beach Escape",
            "Ancient Ruins Adventure",
            "Swiss Alps Getaway",
            "Safari Expedition",
        ];

        return tours
            .filter((tour) => names.includes(tour.title))
            .slice(0, 4);
    }, [tours]);

    const blogPosts = [
        {
            title: "Top 10 Hidden Gems",
            text: "Discover lesser-known places for unforgettable travel.",
            img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=900&auto=format&fit=crop",
        },
        {
            title: "Eco-Friendly Travel Tips",
            text: "Travel smarter and reduce your impact on nature.",
            img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop",
        },
        {
            title: "A Weekend in Kyoto",
            text: "A simple guide for a calm and beautiful weekend.",
            img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=900&auto=format&fit=crop",
        },
    ];

    const categories = [
        "Coastal",
        "Mountain",
        "Urban",
        "History",
        "Wildlife",
        "Adventure",
    ];

    return (
        <div className="home-page">
            <section className="hero-new">
                <div className="hero-new-content">
                    <span className="hero-label">Travel agency platform</span>
                    <h1>Find your perfect travel experience</h1>
                    <p>
                        Explore tours, compare destinations, check prices and calculate your
                        trip cost in a few clicks.
                    </p>
                    <Link to="/tours" className="primary-btn large-btn">
                        Explore tours
                    </Link>
                </div>
            </section>

            <ScrollReveal>
                <section className="home-section">
                    <div className="section-title-row">
                        <h2>Featured Tours</h2>
                        <Link to="/tours" className="text-link">
                            View all
                        </Link>
                    </div>

                    <div className="featured-grid">
                        {featuredTours.map((tour, index) => {
                            const image =
                                tour.images?.[0]?.url ||
                                tour.imageUrl ||
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";

                            return (
                                <ScrollReveal key={tour.id} delay={index * 100}>
                                    <Link to={`/tours/${tour.id}`} className="featured-card">
                                        <img src={image} alt={tour.title} />
                                        <div>
                                            <h3>{tour.title}</h3>
                                            <p>${tour.price}</p>
                                            <StarRating rating={tour.rating || 0} />
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </section>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <section className="home-split">
                    <div className="about-card">
                        <h2>About Us</h2>
                        <p>
                            TravelGuide is a modern travel platform where users can browse
                            tours, view galleries, calculate trip cost and leave reviews after
                            registration.
                        </p>
                        <p>
                            The admin panel allows managing tours, guides, customers,
                            bookings, payments and reviews in one place.
                        </p>
                    </div>

                    <div className="blog-preview">
                        <h2>Travel Blog</h2>
                        <div className="blog-grid">
                            {blogPosts.map((post, index) => (
                                <ScrollReveal key={post.title} delay={index * 120}>
                                    <article className="blog-card-small">
                                        <img src={post.img} alt={post.title} />
                                        <h3>{post.title}</h3>
                                        <p>{post.text}</p>
                                    </article>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            <ScrollReveal delay={120}>
                <section className="category-section">
                    {categories.map((item, index) => (
                        <ScrollReveal key={item} delay={index * 80}>
                            <div className="category-card">
                                <div className="category-icon">✦</div>
                                <h3>{item}</h3>
                                <p>Explore tours and experiences in this category.</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </section>
            </ScrollReveal>

            <ScrollReveal delay={150}>
                <section className="reviews-preview">
                    <h2>What Our Travelers Say</h2>

                    <div className="traveler-grid">
                        <div className="traveler-card">
                            <p>
                                “A very convenient platform. I found a tour, checked details and
                                calculated the cost quickly.”
                            </p>
                            <strong>Sarah J.</strong>
                        </div>

                        <div className="traveler-card">
                            <p>
                                “The gallery and reviews helped me choose the right trip. Simple
                                and useful.”
                            </p>
                            <strong>David L.</strong>
                        </div>

                        <div className="traveler-card">
                            <p>
                                “The admin panel is easy to use and all tour data is organized
                                clearly.”
                            </p>
                            <strong>Admin feedback</strong>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            <footer className="footer-new">
                <div>
                    <h2>TravelGuide</h2>
                    <p>Your reliable platform for managing and choosing travel tours.</p>
                </div>

                <div>
                    <h3>Quick Links</h3>
                    <p>Home</p>
                    <p>Tours</p>
                    <p>Admin</p>
                    <p>Login/Register</p>
                </div>

                <div>
                    <h3>Destinations</h3>
                    <p>Europe</p>
                    <p>Asia</p>
                    <p>America</p>
                    <p>Africa</p>
                </div>

                <div>
                    <h3>Contact</h3>
                    <p>Phone: +373 123 456 789</p>
                    <p>Email: travelguide@mail.com</p>
                    <p>Address: Chisinau, Moldova</p>
                </div>
            </footer>
        </div>
    );
}