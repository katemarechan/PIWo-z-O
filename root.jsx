// src/routes/root.jsx
import { Outlet, Link } from "react-router-dom";
import { useState, createContext } from "react";
import { BookProvider } from "../contexts/BookContext";
import "../index.css";

// Create context for user authentication
export const AuthContext = createContext(null);

export default function Root() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        // Simple toggle for now - in a real app, this would use proper authentication
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <BookProvider>
                <div className="app-container">
                    <header>
                        <h1>WELCOME TO MOONEY'S</h1>
                        <div className="nav">
                            <button onClick={handleLogin}>
                                {isLoggedIn ? "Logout" : "Login"}
                            </button> |
                            <Link to="#">Register</Link> |
                            <Link to="#">Basket</Link>
                        </div>
                        {isLoggedIn && (
                            <div className="admin-nav">
                                <Link to="/">Home</Link> |
                                <Link to="/new">Add New Book</Link>
                            </div>
                        )}
                    </header>

                    <main>
                        <Outlet />
                    </main>

                    <footer>
                        <p>© 2025 Mooney's Bookstore</p>
                    </footer>
                </div>
            </BookProvider>
        </AuthContext.Provider>
    );
}