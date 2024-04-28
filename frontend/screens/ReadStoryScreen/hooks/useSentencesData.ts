import { useEffect, useState } from "react";
// Assets
import stories from "../../../assets/stories.json";
// Utils
import { splitSentence } from "../../../utils/text";

interface IUseSentencesDataProps {
    storyIndex: number,
    currentLanguageCode: string
}

export default function useSentencesData({storyIndex, currentLanguageCode}: IUseSentencesDataProps){

    const [sentencesData, setSentencesData] = useState<Record<string, string|string[]>[] | null>(null);

    useEffect(() => {

        const story = stories[storyIndex];
        const currentLanguageSentences: string[] = story[2][currentLanguageCode].split(/[.!?]/).filter(Boolean);
        const translatedSentences: string[] = story[1].split(/[.!?]/).filter(Boolean);
    
        const data: Record<string, string|string[]>[] = currentLanguageSentences.map((sentence, idx) => {
            
            return ({
            "sentence": sentence,
            "translated_sentence": translatedSentences[idx],
            "words": splitSentence(sentence, currentLanguageCode)
            });
        });

        setSentencesData(data);

    }, []);

    return { sentencesData }; 
}