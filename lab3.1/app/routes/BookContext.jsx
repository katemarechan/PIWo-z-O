// src/contexts/BookContext.jsx
import { createContext, useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch books from Firestore
    const fetchBooks = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "books"));
            const booksData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(booksData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Function to add a new book
    const addBook = async (newBook) => {
        try {
            // Add timestamp and ensure owner info is included
            const bookWithMetadata = {
                ...newBook,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await addDoc(collection(db, "books"), bookWithMetadata);
            const addedBook = { id: docRef.id, ...bookWithMetadata };

            // Update local state
            setBooks(prevBooks => [...prevBooks, addedBook]);

            return docRef.id;
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    };

    // Function to update a book
    const updateBook = async (id, updatedData) => {
        try {
            // Add updated timestamp
            const dataWithTimestamp = {
                ...updatedData,
                updatedAt: new Date()
            };

            const bookRef = doc(db, "books", id);
            await updateDoc(bookRef, dataWithTimestamp);

            // Update local state
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === id ? { ...book, ...dataWithTimestamp } : book
                )
            );

            return id;
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    };

    // Function to delete a book
    const deleteBook = async (id) => {
        try {
            await deleteDoc(doc(db, "books", id));

            // Update local state
            setBooks(prevBooks => prevBooks.filter(book => book.id !== id));

            return true;
        } catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        }
    };

    // Function to get books by owner (current user)
    const getMyBooks = async (userId) => {
        try {
            const q = query(collection(db, "books"), where("ownerId", "==", userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching user books:", error);
            throw error;
        }
    };

    // Function to check if a user owns a specific book
    const isBookOwner = (bookId, userId) => {
        const book = books.find(book => book.id === bookId);
        return book && book.ownerId === userId;
    };

    // Values to be provided to consumers
    const value = {
        books,
        loading,
        addBook,
        updateBook,
        deleteBook,
        getMyBooks,
        isBookOwner,
        refreshBooks: fetchBooks
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
};