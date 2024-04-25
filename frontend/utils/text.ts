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
