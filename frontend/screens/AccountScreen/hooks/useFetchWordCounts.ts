import { useState, useEffect } from 'react';
import client from "../../../utils/axios";

export const useFetchWordCounts = (currentUser) => {
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});

    const fetchWordCounts = async() => {
        try {
            const res = await client.get(
                './api/users/' + currentUser.user_id + '/wordcounts',
                { withCredentials: true }
            );
            setWordCounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWordCounts();
    }, []);

    return wordCounts;
};