import { useEffect, useState, useContext } from "react";
// Contexts
import UserContext from "../../../contexts/UserContext";
// Utils
import { calcLevel } from "../../../utils/functions";

export default function useLevel(knownWords: number){

    const [levelData, setLevelData] = useState({
        level: 0,
        wordsInLevel: 0,
        knownWordsInLevel: 0
    });

    useEffect(() => {
        const newLevelData = calcLevel(knownWords, 30000);
        setLevelData(newLevelData);
    }, [knownWords]);

    return levelData;
}