import { useEffect, useState, useContext } from "react";
// Utils
import client from "../../../utils/axios";
// Contexts
import UserContext from "../../../contexts/UserContext";
// Interfaces
import { ISentence } from "../../../interfaces";

export default function useFetchItems(sentencesData?: ISentence[] | null){
    // If no sentencesData provided, then fetch sentences from the server

    const { currentLanguageCode, knownWordsPercentage } = useContext(UserContext);
    
    const [items, setItems] = useState<ISentence|null>(null);

    //const [currentItem, setCurrentItem] = useState(items[0]);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemIndex, setItemIndex] = useState<number>(0);
    const [isStoryMode, _] = useState<boolean>(sentencesData !== null);

    useEffect(() => {
        // If sentencesData not provided to component, then fetch
        // sentences from the database
        if (!isStoryMode) {
            fetchData();
        } else {
            setItemIndex(0);
            setCurrentItem(sentencesData[0]);
            setItems(sentencesData);  
        }
    }, [currentLanguageCode, knownWordsPercentage])

    const fetchData = async() => {
        client.get("/api/sentences/" + knownWordsPercentage, { withCredentials: true })
        .then(function(res) {
            // Make sure each item's word field in converted from stringified
            // json to real object   
            const data = res.data.map(item => {

                // Convert from postgresql array format
                if (typeof item.words === 'string') {
                    item = { ...item, words: JSON.parse(item.words) };
                }
                return item;
            })
            setItemIndex(0);
            setCurrentItem(data[0]);
            setItems(data);
        })
        .catch(function(error) {
            console.log(error);
        });
    };

    const changeItem = (increment: 1|-1) => {
        
        // Can only decrement in storyMode
        if (!isStoryMode && increment == -1) return;

        const endIndex = items.length - 1;  
        const isEdgeSentence = (0 <= itemIndex <= endIndex);
        
        if (isEdgeSentence) {

            const stepOutOfRange = (
                itemIndex <= 0 && increment == -1
                || itemIndex >= endIndex && increment == 1
            );

            // increment takes us out of the allowed range
            if (stepOutOfRange) {
                if (isStoryMode) {
                    console.log('Leaving the range');
                } else {
                    // Need to load more data if not story
                    fetchData();
                }
            return;
            }
        }

        setItemIndex(prevIndex => prevIndex + increment);
        let newItem = items[itemIndex + increment];
        setCurrentItem(newItem);

    };

    return { currentItem, changeItem }; 
}