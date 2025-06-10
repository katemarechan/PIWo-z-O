// src/routes/new.jsx
import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./root";
import { BookContext } from "../contexts/BookContext";
import useBookForm from "../hooks/useBookForm";

export default function NewBook() {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);
    const { addBook } = useContext(BookContext);

    // Use custom form hook
    const {
        formData,
        handleChange,
        isSubmitting,
        setIsSubmitting,
        error,
        setError,
        resetForm
    } = useBookForm();

    // Memoize the submit handler to prevent recreation on each render
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Ensure user is logged in
        if (!isLoggedIn || !user) {
            setError("You must be logged in to add books");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Format the data properly
            const bookData = {
                ...formData,
                price: parseFloat(formData.price || 0),
                pages: parseInt(formData.pages || 0),
                year: parseInt(formData.year || 0),
                // Add owner information
                ownerId: user.uid,
                ownerName: user.displayName || user.email
            };

            // Add the book to our context/Firestore
            await addBook(bookData);

            // Go back to the main page
            navigate("/");
        } catch (error) {
            console.error("Error adding book:", error);
            setError("Failed to add book. Please try again.");
            setIsSubmitting(false);
        }
    }, [formData, isLoggedIn, user, addBook, navigate, setError, setIsSubmitting]);

    // Redirect if not logged in
    if (!isLoggedIn) {
        return (
            <div className="not-authorized">
                <h2>Not Authorized</h2>
                <p>You need to be logged in to add new books.</p>
                <button onClick={() => navigate("/")}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="new-book-container">
            <h2>Add New Book</h2>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form className="add-book-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter book title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        placeholder="Enter author name"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <div className="price-input">
                        <span className="currency-symbol">$</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="cover">Cover type:</label>
                    <select
                        id="cover"
                        name="cover"
                        value={formData.cover}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select cover type</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Paperback">Paperback</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="pages">Number of pages:</label>
                    <input
                        type="number"
                        id="pages"
                        name="pages"
                        min="1"
                        placeholder="Enter number of pages"
                        value={formData.pages}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="year">Publication Year:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        min="1400"
                        max="2025"
                        placeholder="Enter publication year"
                        value={formData.year}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        placeholder="Enter book description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? "submitting" : ""}
                    >
                        {isSubmitting ? "Adding..." : "Add Book"}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="clear-button"
                    >
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
}