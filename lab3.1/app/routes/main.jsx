// src/routes/main.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './root';
import { BookContext } from '../contexts/BookContext';
import '../index.css';

export default function MainPage() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const { books, loading, deleteBook, refreshBooks } = useContext(BookContext);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [showMyBooks, setShowMyBooks] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        searchText: "",
        priceFrom: "",
        priceTo: "",
        cover: "All",
        pagesFrom: "",
        pagesTo: "",
        author: "",
        description: ""
    });

    // Initialize filtered books when books change
    useEffect(() => {
        if (showMyBooks && user) {
            // If "MY BOOKS" is active, filter books by current user
            const userBooks = books.filter(book => book.ownerId === user.uid);
            setFilteredBooks(userBooks);
        } else {
            setFilteredBooks(books);
        }
    }, [books, showMyBooks, user]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters({
            ...searchFilters,
            [name]: value
        });
    };

    // Toggle between all books and my books
    const toggleMyBooks = () => {
        setShowMyBooks(!showMyBooks);
    };

    // Apply filters
    const applyFilters = (e) => {
        e.preventDefault();

        // Start with appropriate book set based on filter setting
        let booksToFilter = showMyBooks && user
            ? books.filter(book => book.ownerId === user.uid)
            : books;

        // Then apply search filters
        const filtered = booksToFilter.filter(book => {
            // Search text (title)
            if (searchFilters.searchText &&
                !book.title.toLowerCase().includes(searchFilters.searchText.toLowerCase())) {
                return false;
            }

            // Price range
            if (searchFilters.priceFrom && book.price < parseFloat(searchFilters.priceFrom)) {
                return false;
            }
            if (searchFilters.priceTo && book.price > parseFloat(searchFilters.priceTo)) {
                return false;
            }

            // Cover type
            if (searchFilters.cover !== "All" && book.cover !== searchFilters.cover) {
                return false;
            }

            // Page range
            if (searchFilters.pagesFrom && book.pages < parseInt(searchFilters.pagesFrom)) {
                return false;
            }
            if (searchFilters.pagesTo && book.pages > parseInt(searchFilters.pagesTo)) {
                return false;
            }

            // Author
            if (searchFilters.author &&
                !book.author.toLowerCase().includes(searchFilters.author.toLowerCase())) {
                return false;
            }

            // Description
            if (searchFilters.description &&
                !book.description.toLowerCase().includes(searchFilters.description.toLowerCase())) {
                return false;
            }

            return true;
        });

        setFilteredBooks(filtered);
    };

    // Handle book deletion
    const handleDeleteBook = async (id) => {
        if (!user) return;

        // Find the book to check ownership
        const bookToDelete = books.find(book => book.id === id);

        // Only allow deletion if user owns the book
        if (bookToDelete && bookToDelete.ownerId === user.uid) {
            if (window.confirm("Are you sure you want to delete this book?")) {
                try {
                    await deleteBook(id);
                    // Refresh book list after deletion
                    refreshBooks();
                } catch (error) {
                    console.error("Error deleting book:", error);
                    alert("Failed to delete book. Please try again.");
                }
            }
        } else {
            alert("You can only delete books that you have added.");
        }
    };

    if (loading) {
        return <div className="loading">Loading books...</div>;
    }

    return (
        <div>
            <section className="search">
                <h2>Search</h2>
                <form onSubmit={applyFilters}>
                    <div className="search-row">
                        <input
                            type="text"
                            name="searchText"
                            placeholder="Search for a book title..."
                            value={searchFilters.searchText}
                            onChange={handleFilterChange}
                        />
                        <button type="submit">Search</button>

                        {isLoggedIn && (
                            <button
                                type="button"
                                className={`my-books-btn ${showMyBooks ? 'active' : ''}`}
                                onClick={toggleMyBooks}
                            >
                                {showMyBooks ? "ALL BOOKS" : "MY BOOKS"}
                            </button>
                        )}
                    </div>

                    <div className="filters">
                        <h3>Filter books:</h3>
                        <div className="filter-row">
                            <label>
                                Price From:
                                <input
                                    type="number"
                                    name="priceFrom"
                                    min="0"
                                    placeholder="Min price"
                                    value={searchFilters.priceFrom}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                To:
                                <input
                                    type="number"
                                    name="priceTo"
                                    min="0"
                                    placeholder="Max price"
                                    value={searchFilters.priceTo}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>
                                Cover:
                                <select
                                    name="cover"
                                    value={searchFilters.cover}
                                    onChange={handleFilterChange}
                                >
                                    <option>All</option>
                                    <option>Hardcover</option>
                                    <option>Paperback</option>
                                </select>
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>
                                Page number from:
                                <input
                                    type="number"
                                    name="pagesFrom"
                                    min="0"
                                    placeholder="Min pages"
                                    value={searchFilters.pagesFrom}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Page number to:
                                <input
                                    type="number"
                                    name="pagesTo"
                                    min="0"
                                    placeholder="Max pages"
                                    value={searchFilters.pagesTo}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>
                                Author:
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="Author name"
                                    value={searchFilters.author}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <div className="filter-row">
                            <label>
                                Word in description:
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Search in description"
                                    value={searchFilters.description}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                    </div>
                </form>
            </section>

            <div className="book-list-header">
                <h2>Book List</h2>
                {isLoggedIn && (
                    <div className="add-book-button">
                        <Link to="/new" className="button-link">Add new book</Link>
                    </div>
                )}
            </div>

            <div className="books">
                {filteredBooks.length === 0 ? (
                    <p className="no-books">No books found matching your criteria.</p>
                ) : (
                    filteredBooks.map(book => (
                        <div key={book.id} className="book">
                            <h3>{book.title}</h3>
                            <p className="book-author">By: {book.author}</p>
                            <p className="book-price">${book.price.toFixed(2)}</p>
                            <p>Cover: {book.cover}</p>
                            <p>Pages: {book.pages}</p>
                            <p>Year: {book.year}</p>
                            <p className="book-description">{book.description}</p>

                            {book.ownerId === user?.uid && (
                                <div className="owner-badge">Added by you</div>
                            )}

                            {isLoggedIn && book.ownerId === user?.uid && (
                                <div className="book-actions">
                                    <Link to={`/edit/${book.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}