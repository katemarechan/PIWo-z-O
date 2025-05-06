// src/routes/main.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './root';
import { BookContext } from '../contexts/BookContext';
import '../index.css';

export default function MainPage() {
    const { isLoggedIn } = useContext(AuthContext);
    const { books, deleteBook } = useContext(BookContext);
    const [filteredBooks, setFilteredBooks] = useState([]);
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
        setFilteredBooks(books);
    }, [books]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters({
            ...searchFilters,
            [name]: value
        });
    };

    // Apply filters
    const applyFilters = (e) => {
        e.preventDefault();
        const filtered = books.filter(book => {
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
    const handleDeleteBook = (id) => {
        deleteBook(id);
    };

    return (
        <div>
            <section className="search">
                <h2>Search</h2>
                <form onSubmit={applyFilters}>
                    <div>
                        <input
                            type="text"
                            name="searchText"
                            placeholder="Search for a book title..."
                            value={searchFilters.searchText}
                            onChange={handleFilterChange}
                        />
                        <button type="submit">Search</button>
                    </div>

                    <div className="filters">
                        <h3>Filter books:</h3>
                        <div>
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
                        <div>
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
                        <div>
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
                        <div>
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
                        <div>
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

            <h2>Book List</h2>
            <div>
                <Link to="/new">Add new position</Link>
            </div>

            <div className="books">
                {filteredBooks.length === 0 ? (
                    <p>No books found matching your criteria.</p>
                ) : (
                    filteredBooks.map(book => (
                        <div key={book.id} className="book">
                            <h3>{book.title}</h3>
                            <p>Author: {book.author}</p>
                            <p>Price: ${book.price}</p>
                            <p>Cover: {book.cover}</p>
                            <p>Pages: {book.pages}</p>
                            <p>Year: {book.year}</p>
                            <p>Description: {book.description}</p>

                            {isLoggedIn && (
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