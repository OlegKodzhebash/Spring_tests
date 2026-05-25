import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo">TravelGuide</div>

                <nav className="nav">
                    <NavLink to="/" className="nav-link">
                        Home
                    </NavLink>

                    <NavLink to="/tours" className="nav-link">
                        Tours
                    </NavLink>

                    <NavLink to="/admin" className="nav-link">
                        Admin
                    </NavLink>

                    <NavLink to="/auth" className="nav-link">
                        Login/Register
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}