// src/routes/edit.jsx

import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./root";
import { BookContext } from "../contexts/BookContext";
import useBookForm from "../hooks/useBookForm";
import { useEffect, useContext, useCallback, useState } from "react";

export default function EditBook() {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);
    const { books, updateBook } = useContext(BookContext);
    const { id } = useParams();

    // Use custom form hook
    const {
        formData,
        setFormData,
        handleChange,
        isSubmitting,
        setIsSubmitting,
        error,
        setError
    } = useBookForm();

    const [loading, setLoading] = useState(true);

    // Load book data once when component mounts
    useEffect(() => {
        // Redirect if not logged in
        if (!isLoggedIn || !user) {
            navigate("/");
            return;
        }

        // Find the book in our context
        const book = books.find(book => book.id === id);

        if (!book) {
            setError("Book not found");
            setLoading(false);
            return;
        }

        // Check if user owns this book
        if (book.ownerId !== user.uid) {
            setError("You can only edit books that you have added");
            setLoading(false);
            return;
        }

        // Book found and user is owner, populate form
        setFormData({
            title: book.title || "",
            author: book.author || "",
            price: book.price || "",
            cover: book.cover || "",
            pages: book.pages || "",
            year: book.year || "",
            description: book.description || ""
        });
        setLoading(false);
    }, [id, books, user, isLoggedIn, navigate, setFormData, setError]);

    // Memoize the submit handler to prevent recreation on each render
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Ensure user is logged in and book exists
        if (!isLoggedIn || !user) {
            setError("You must be logged in to edit books");
            return;
        }

        // Find the book again to check permissions
        const bookToEdit = books.find(book => book.id === id);
        if (!bookToEdit || bookToEdit.ownerId !== user.uid) {
            setError("You don't have permission to edit this book");
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
                year: parseInt(formData.year || 0)
            };

            // Preserve owner information
            bookData.ownerId = bookToEdit.ownerId;
            bookData.ownerName = bookToEdit.ownerName;

            // Update the book
            await updateBook(id, bookData);

            // Go back to the main page
            navigate("/");
        } catch (error) {
            console.error("Error updating book:", error);
            setError("Failed to update book. Please try again.");
            setIsSubmitting(false);
        }
    }, [formData, id, books, isLoggedIn, user, updateBook, navigate, setError, setIsSubmitting]);

    // Show loading indicator
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // Show error if any
    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="edit-book-container">
            <h2>Edit Book</h2>

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
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}