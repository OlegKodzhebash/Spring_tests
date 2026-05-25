import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ToursPage from "./pages/ToursPage";
import TourDetailsPage from "./pages/TourDetailsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tours" element={<ToursPage />} />
                <Route path="/tours/:id" element={<TourDetailsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </Layout>
    );
}