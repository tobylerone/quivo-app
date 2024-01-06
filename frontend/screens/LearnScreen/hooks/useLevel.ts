import { useEffect, useState, useContext } from "react";
// Contexts
import UserContext from "../../../contexts/UserContext";
// Utils
import { calcLevel } from "../../../utils/functions";

export default function useLevel(knownWords: number){

    const { currentUser, currentLanguage } = useContext(UserContext);

    const [level, setLevel] = useState(0);
    const [levelResidual, setLevelResidual] = useState(0);
    
    useEffect(() => {

        // TODO: Replace this quick fix
        const words = knownWords !== undefined ? knownWords : currentUser.known_words_count[currentLanguage];

        const {level, levelResidual} = calcLevel(words, 30000);
        setLevel(level);
        setLevelResidual(levelResidual);
    }, [knownWords]);

    return { level, levelResidual };
}