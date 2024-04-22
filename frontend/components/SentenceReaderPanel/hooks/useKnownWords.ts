import { useEffect, useState, useContext } from "react";
// Contexts
import UserContext from "../../../contexts/UserContext";

export default function useKnownWords(){

    const { currentUser, currentLanguageCode } = useContext(UserContext);

    const [knownWords, setKnownWords] = useState<number>(0);
    
    useEffect(() => {
        if (currentUser.known_words_count[currentLanguageCode]) {
            setKnownWords(currentUser.known_words_count[currentLanguageCode]);
        }
    }, [currentUser, currentLanguageCode]);

    return { knownWords };
}