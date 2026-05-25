export default function StarRating({ rating = 0 }) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push("full");
        } else if (rating >= i - 0.5) {
            stars.push("half");
        } else {
            stars.push("empty");
        }
    }

    return (
        <div className="star-rating">
            {stars.map((type, index) => (
                <span key={index} className={`star ${type}`}>
          ★
        </span>
            ))}
        </div>
    );
}