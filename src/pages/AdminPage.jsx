import { useState } from "react";
import GuidesAdmin from "../components/admin/GuidesAdmin";
import ToursAdmin from "../components/admin/ToursAdmin";
import CustomersAdmin from "../components/admin/CustomersAdmin";
import BookingsAdmin from "../components/admin/BookingsAdmin";
import PaymentsAdmin from "../components/admin/PaymentsAdmin";
import ReviewsAdmin from "../components/admin/ReviewsAdmin";

export default function AdminPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    function handleDataChanged() {
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <section>
            <div className="page-header">
                <h1>Admin panel</h1>
                <p>Manage all data used by the travel website.</p>
            </div>

            <GuidesAdmin onDataChanged={handleDataChanged} />
            <ToursAdmin refreshKey={refreshKey} onDataChanged={handleDataChanged} />
            <CustomersAdmin onDataChanged={handleDataChanged} />
            <BookingsAdmin refreshKey={refreshKey} onDataChanged={handleDataChanged} />
            <PaymentsAdmin refreshKey={refreshKey} onDataChanged={handleDataChanged} />
            <ReviewsAdmin refreshKey={refreshKey} onDataChanged={handleDataChanged} />
        </section>
    );
}