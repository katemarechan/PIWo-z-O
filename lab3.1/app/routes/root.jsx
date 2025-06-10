// src/routes/root.jsx
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { BookProvider } from "../contexts/BookContext";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import app from "../firebase";
import "../index.css";

// Create context for user authentication
export const AuthContext = createContext(null);

export default function Root() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoggedIn(!!currentUser);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [auth]);

    const handleLogin = async () => {
        if (isLoggedIn) {
            try {
                await signOut(auth);
            } catch (error) {
                console.error("Logout error:", error);
            }
        } else {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error("Login error:", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn }}>
            <BookProvider>
                <div className="app-container">
                    <header>
                        <h1>WELCOME TO MOONEY'S</h1>
                        <div className="nav">
                            <button onClick={handleLogin}>
                                {isLoggedIn ? "Logout" : "Login with Google"}
                            </button> |
                            <Link to="#">Basket</Link>
                            {isLoggedIn && (
                                <>
                                    | <span>Hello, {user?.displayName || "User"}</span>
                                </>
                            )}
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