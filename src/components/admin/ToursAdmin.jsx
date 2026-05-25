import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";

export default function ToursAdmin({ refreshKey, onDataChanged }) {
    const [tours, setTours] = useState([]);
    const [guides, setGuides] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    const [form, setForm] = useState({
        title: "",
        destination: "",
        price: "",
        durationDays: "",
        guideId: "",
        description: "",
        hotelName: "",
        foodType: "",
        rating: "",
        availablePlaces: "",
        pricePerDay: "",
    });

    useEffect(() => {
        loadData();
    }, [refreshKey]);

    async function loadData() {
        try {
            const [toursData, guidesData] = await Promise.all([
                api.getTours(),
                api.getGuides(),
            ]);
            setTours(toursData);
            setGuides(guidesData);
            setError("");
        } catch (e) {
            setError(e.message);
        }
    }

    function resetForm() {
        setForm({
            title: "",
            destination: "",
            price: "",
            durationDays: "",
            guideId: "",
            description: "",
            hotelName: "",
            foodType: "",
            rating: "",
            availablePlaces: "",
            pricePerDay: "",
        });
        setSelectedFiles([]);
        setExistingImageUrls([]);
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let uploadedUrls = existingImageUrls;

            if (selectedFiles.length > 0) {
                const uploaded = await api.uploadTourImages(selectedFiles);
                uploadedUrls = uploaded.map((item) => item.url);
            }

            const payload = {
                title: form.title,
                destination: form.destination,
                price: Number(form.price),
                durationDays: Number(form.durationDays),
                guideId: Number(form.guideId),
                description: form.description,
                imageUrl: uploadedUrls[0] || "",
                hotelName: form.hotelName,
                foodType: form.foodType,
                rating: Number(form.rating),
                availablePlaces: Number(form.availablePlaces),
                pricePerDay: Number(form.pricePerDay),
                imageUrls: uploadedUrls,
            };

            if (editingId) {
                await api.updateTour(editingId, payload);
            } else {
                await api.createTour(payload);
            }

            resetForm();
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleEdit(tour) {
        setEditingId(tour.id);
        setForm({
            title: tour.title || "",
            destination: tour.destination || "",
            price: tour.price || "",
            durationDays: tour.durationDays || "",
            guideId: tour.guide?.id || "",
            description: tour.description || "",
            hotelName: tour.hotelName || "",
            foodType: tour.foodType || "",
            rating: tour.rating || "",
            availablePlaces: tour.availablePlaces || "",
            pricePerDay: tour.pricePerDay || "",
        });
        setExistingImageUrls((tour.images || []).map((img) => img.url));
        setSelectedFiles([]);
    }

    async function handleDelete(id) {
        try {
            await api.deleteTour(id);
            await loadData();

            if (onDataChanged) {
                onDataChanged();
            }
        } catch (e) {
            setError(e.message);
        }
    }

    function handleFileChange(e) {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    }

    function removeSelectedFile(indexToRemove) {
        setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    }

    const previewUrls = useMemo(() => {
        return selectedFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
    }, [selectedFiles]);

    return (
        <section className="admin-section">
            <h2>Tours management</h2>

            <form className="admin-form admin-form-large" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Destination"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Duration days"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                />

                <select
                    value={form.guideId}
                    onChange={(e) => setForm({ ...form, guideId: e.target.value })}
                >
                    <option value="">Select guide</option>
                    {guides.map((guide) => (
                        <option key={guide.id} value={guide.id}>
                            {guide.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Hotel name"
                    value={form.hotelName}
                    onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Food type"
                    value={form.foodType}
                    onChange={(e) => setForm({ ...form, foodType: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Available places"
                    value={form.availablePlaces}
                    onChange={(e) =>
                        setForm({ ...form, availablePlaces: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Price per day"
                    value={form.pricePerDay}
                    onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="upload-card">
                    <div className="upload-card-header">
                        <span className="upload-title">Gallery images</span>
                        <span className="upload-count">
              {selectedFiles.length > 0
                  ? `${selectedFiles.length} selected`
                  : existingImageUrls.length > 0
                      ? `${existingImageUrls.length} current`
                      : "No files chosen"}
            </span>
                    </div>

                    <label className="upload-button">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden-file-input"
                        />
                        Choose images
                    </label>

                    {selectedFiles.length > 0 && (
                        <>
                            <div className="upload-file-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="upload-file-item">
                                        <span className="upload-file-name">{file.name}</span>
                                        <button
                                            type="button"
                                            className="remove-file-btn"
                                            onClick={() => removeSelectedFile(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mini-gallery">
                                {previewUrls.map((file, index) => (
                                    <div key={index} className="mini-gallery-card">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="mini-gallery-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {selectedFiles.length === 0 && existingImageUrls.length > 0 && (
                        <div className="mini-gallery">
                            {existingImageUrls.map((url, index) => (
                                <div key={index} className="mini-gallery-card">
                                    <img src={url} alt="Existing" className="mini-gallery-image" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="primary-btn" type="submit">
                    {editingId ? "Update tour" : "Add tour"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="admin-list">
                {tours.map((tour) => (
                    <div key={tour.id} className="admin-card">
                        <div>
                            <strong>{tour.title}</strong> — {tour.destination} | ${tour.price}
                            {" | "}
                            Images: {tour.images?.length || 0}
                        </div>
                        <div className="actions">
                            <button className="secondary-btn" onClick={() => handleEdit(tour)}>
                                Edit
                            </button>
                            <button className="danger-btn" onClick={() => handleDelete(tour.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}