import { useState, useEffect } from 'react';
import client from "../../../utils/axios";

export const useFetchFaqs = () => {
    const [faqData, setFaqData] = useState<Record<string, string>[]|null>(null);

    const fetchFaqs = async() => {
        try {
            const res = await client.get(
                './api/faqs',
                { withCredentials: true }
            );
            setFaqData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return faqData;
};