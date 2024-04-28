import * as Speech from "expo-speech";

export const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
    }

export const speak = (sentence: string, language_code: string, narration_speed: number) => {
    Speech.stop();
    Speech.speak(
        sentence,
        {
            language: language_code,
            rate: narration_speed
        }
    );
};

export function splitSentence(sentence: string, languageCode: string) {
// Based on the python version in MLNotebooks  

    const regex: Record<string, string> = {
        'fr': /[Aa]ujourd'hui|[Pp]resqu'île|[Qq]uelqu'un|[Dd]'accord|[a-zA-ZéèêëÉÈÊËàâäÀÂÄôöÔÖûüùÛÜÙçÇîÎïÏ]+/g,
        'de': /[a-zA-ZäöüÄÖÜß]+/g,
        'ru': /[А-Яа-яЁё]+/g
        }[languageCode]

    const shortenedWordMap: Record<string, string> = {
        'j': 'je',
        'l': 'le',
        't': 'tu',
        'd': 'de',
        'c': 'ce',
        's': 'se',
        'qu': 'que',
        'm': 'me',
        'n': 'ne',
        }    

    // Split all words in the sentence by word boundaries (Split uninclusively at punctuation or non-alphanumeric characters)
    let words = sentence.match(regex);
    // Set all words to lowercase
    words = words.map(word => word.toLowerCase());

    // Replace any shortened word with their full-length equivalent
    if (languageCode == 'fr') {
        words = words.map(word => shortenedWordMap[word] || word);
    }

    console.log(words);

    return words;
}