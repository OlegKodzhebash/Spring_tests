import { useMemo, useState } from "react";

export default function TourGallery({ tour }) {
    const imageList = useMemo(() => {
        const gallery = (tour.images || []).map((img) => img.url).filter(Boolean);

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

    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className="gallery">
            <img
                src={imageList[selectedIndex]}
                alt={tour.title}
                className="gallery-main-image"
            />

            {imageList.length > 1 && (
                <div className="gallery-thumbs">
                    {imageList.map((img, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`gallery-thumb-btn ${
                                index === selectedIndex ? "active-thumb" : ""
                            }`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img src={img} alt={`Tour ${index + 1}`} className="gallery-thumb-image" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}