// src/hooks/useBookForm.js
import { useState, useCallback } from 'react';

export default function useBookForm(initialData = {}) {
    // Initialize with default empty values and override with any provided data
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: "",
        cover: "",
        pages: "",
        year: "",
        description: "",
        ...initialData
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the change handler to prevent recreating it on each render
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    // Reset form to initial values or empty values
    const resetForm = useCallback(() => {
        setFormData({
            title: "",
            author: "",
            price: "",
            cover: "",
            pages: "",
            year: "",
            description: "",
            ...initialData
        });
        setError(null);
    }, [initialData]);

    return {
        formData,
        setFormData,
        handleChange,
        isSubmitting,
        setIsSubmitting,
        error,
        setError,
        resetForm
    };
}