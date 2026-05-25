const API_URL = "http://localhost:8080";

async function jsonRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
}

async function uploadFilesRequest(endpoint, files) {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Upload failed");
    }

    return data;
}

export const api = {
    register: (body) =>
        jsonRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(body),
        }),

    login: (body) =>
        jsonRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
        }),

    logout: () =>
        jsonRequest("/auth/logout", {
            method: "POST",
        }),

    me: () => jsonRequest("/auth/me"),

    uploadTourImages: (files) => uploadFilesRequest("/uploads/tour-images", files),

    getTours: () => jsonRequest("/tours"),
    getTourById: (id) => jsonRequest(`/tours/${id}`),
    createTour: (body) =>
        jsonRequest("/tours", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updateTour: (id, body) =>
        jsonRequest(`/tours/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deleteTour: (id) =>
        jsonRequest(`/tours/${id}`, {
            method: "DELETE",
        }),

    getGuides: () => jsonRequest("/guides"),
    createGuide: (body) =>
        jsonRequest("/guides", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updateGuide: (id, body) =>
        jsonRequest(`/guides/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deleteGuide: (id) =>
        jsonRequest(`/guides/${id}`, {
            method: "DELETE",
        }),

    getCustomers: () => jsonRequest("/customers"),
    createCustomer: (body) =>
        jsonRequest("/customers", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updateCustomer: (id, body) =>
        jsonRequest(`/customers/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deleteCustomer: (id) =>
        jsonRequest(`/customers/${id}`, {
            method: "DELETE",
        }),

    getBookings: () => jsonRequest("/bookings"),
    createBooking: (body) =>
        jsonRequest("/bookings", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updateBooking: (id, body) =>
        jsonRequest(`/bookings/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deleteBooking: (id) =>
        jsonRequest(`/bookings/${id}`, {
            method: "DELETE",
        }),

    getPayments: () => jsonRequest("/payments"),
    createPayment: (body) =>
        jsonRequest("/payments", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updatePayment: (id, body) =>
        jsonRequest(`/payments/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deletePayment: (id) =>
        jsonRequest(`/payments/${id}`, {
            method: "DELETE",
        }),

    getReviews: () => jsonRequest("/reviews"),
    getReviewsByTour: (tourId) => jsonRequest(`/reviews/tour/${tourId}`),
    createReview: (body) =>
        jsonRequest("/reviews", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    updateReview: (id, body) =>
        jsonRequest(`/reviews/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    deleteReview: (id) =>
        jsonRequest(`/reviews/${id}`, {
            method: "DELETE",
        }),
};