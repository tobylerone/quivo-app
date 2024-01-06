import { useEffect, useState, useContext } from "react";
// Utils
import client from "../../../utils/axios";
// Contexts
import UserContext from "../../../contexts/UserContext";

export default function useFetchItems(){

    const { currentLanguage } = useContext(UserContext);
    const [items, setItems] = useState(null);

    //const [currentItem, setCurrentItem] = useState(items[0]);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemIndex, setItemIndex] = useState<number>(0);

    useEffect(() => {
        fetchData();
    }, [currentLanguage])

    const fetchData = async() => {
        client.get("/api/sentences", { withCredentials: true })
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

    const changeItem = () => {
        
        let newItem = items[itemIndex + 1];

        if (itemIndex < items.length - 1) {
            console.log(itemIndex);
            setItemIndex(prevIndex => prevIndex + 1);
        } else {
            // Want to get new sentences and reset index to 0
            fetchData();
            console.log(itemIndex);
        }
        setCurrentItem(newItem);
    };

    return { currentItem, changeItem }; 
}