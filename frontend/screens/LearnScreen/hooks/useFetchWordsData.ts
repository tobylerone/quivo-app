import { useEffect, useState, useContext } from "react";
// Utils
import client from '../../../utils/axios';
import { speak } from '../../../utils/text';
// Contexts
import UserContext from "../../../contexts/UserContext";

export default function useFetchWordsData(currentItem){

    const { currentLanguage } = useContext(UserContext);
    const [wordsData, setWordsData] = useState();

    useEffect(() => {
        fetchWordsData().then((wordsData) => {
            setWordsData(wordsData);
        });
    }, [currentItem]);

    const fetchWordsData = async() => {
        try {
            const res = await client.post('./api/words', {
                words: currentItem.words,
                withCredentials: true
            });
            return res.data
        } catch (error) {
            console.error(error);
        }
    }

    return { wordsData };
}