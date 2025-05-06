// src/routes/new.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./root";
import { BookContext } from "../contexts/BookContext";

export default function NewBook() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const { addBook } = useContext(BookContext);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        cover: "",
        pages: "",
        year: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the data properly
        const bookData = {
            ...formData,
            price: parseFloat(formData.price),
            pages: parseInt(formData.pages),
            year: parseInt(formData.year)
        };

        // Add the book to our context
        addBook(bookData);
        console.log("New book added:", bookData);

        // Go back to the main page
        navigate("/");
    };

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
        <div>
            <h2>Add New Book</h2>

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
                    <span>$</span>
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
                    <button type="submit">Add Book</button>
                    <button type="reset" onClick={() => setFormData({
                        title: "",
                        author: "",
                        price: "",
                        cover: "",
                        pages: "",
                        year: "",
                        description: ""
                    })}>Clear Form</button>
                </div>
            </form>
        </div>
    );
}