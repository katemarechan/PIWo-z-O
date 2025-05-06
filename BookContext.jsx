// src/contexts/BookContext.jsx
import { createContext, useState } from "react";

// Sample initial data
const initialBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        cover: "Paperback",
        pages: 180,
        year: 1925,
        description: "A story of wealth, love, and tragedy in the Jazz Age."
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        cover: "Hardcover",
        pages: 281,
        year: 1960,
        description: "A story of racial injustice and moral growth in the American South."
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 10.99,
        cover: "Paperback",
        pages: 328,
        year: 1949,
        description: "A dystopian novel about totalitarianism and surveillance."
    }
];

// Create the context
export const BookContext = createContext();

// Create the provider component
export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState(initialBooks);

    // Function to add a new book
    const addBook = (newBook) => {
        // Generate a new ID (in a real app, the backend would handle this)
        const newId = Math.max(...books.map(book => book.id)) + 1;
        const bookWithId = { ...newBook, id: newId };
        setBooks([...books, bookWithId]);
    };

    // Function to update a book
    const updateBook = (id, updatedBook) => {
        setBooks(books.map(book =>
            book.id === parseInt(id) ? { ...book, ...updatedBook } : book
        ));
    };

    // Function to delete a book
    const deleteBook = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    // Values to be provided to consumers
    const value = {
        books,
        addBook,
        updateBook,
        deleteBook
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
};