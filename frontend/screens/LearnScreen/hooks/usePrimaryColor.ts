import { useEffect, useState, useContext } from "react";
// Constants
import * as constants from "../../../constants";
// Contexts
import UserContext from "../../../contexts/UserContext";
import { PRIMARYCOLOR } from "../../../constants";

export default function usePrimaryColor(){

    const { currentLanguageCode } = useContext(UserContext);

    // Change the primary color based on the language
    const languagePrimaryColorMap: Record<string, string> = {
        'fr': constants.PURPLEREGULAR,
        'de': constants.GREENREGULAR,
        'ru': constants.ORANGEREGULAR,
        'th': constants.PRIMARYCOLOR
    }

    const [primaryColor, setPrimaryColor] = useState(languagePrimaryColorMap[currentLanguageCode]);

    useEffect(() => {
        setPrimaryColor(languagePrimaryColorMap[currentLanguageCode]);
    }, [currentLanguageCode]);

    return { primaryColor };
}