import { useState, useEffect } from 'react';
// Utils
import { frequencyIndexToComprehensionPercentage as f } from '../../../utils/functions';
export const useComprehensionPercentage = (wordCounts: Record<string, number>) => {
    const [comprehensionPercentage, setComprehensionPercentage] = useState<number | null>(null);

    const getComprehensionPercentage = () => {
        /*
        All words in the corpus are listed in descending order of total appearance, and
        normalised to between 0-100 to model the percentage of the corpus a user should
        be able to understand with each additional new word learned, assuming the words
        were learned from most frequent to least frequent, which is then modelled by 
        a + b/(1 + e**(c * n)), where n represents the frequency rank of a word in the
        corpus, and a, b and c are constants that are determined for a given corpus to
        model its word frequency distribution.
        If the user learned the words of the corpus in perfect frequency order you could
        work out their percentage comprehension by taking n to be the total number of
        words they've learned so far, but since they'll learn new words in an unpredictable
        order, their total comprehension can be found by summing each word's individual
        contribution to overall corpus comprehension. For example, if the user knows the
        nth most frequent word in the corpus, the additional percentage comprehension gained
        by learning that word will be f(n) - f(n-1). By summing this value for all words
        that the user knows, you can calculate the percentage of the corpus they should be
        capable of understanding.

        However, this is computationally expensive, so instead I've counted the number of
        words a user knows in each section of 1000 words in descending order of frequency:
        1-1000, 1001-2000, ... 5000+ most frequent etc. I then make the assumption that the
        user learned the words in this 'bucket' in correct frequency order to arrive at an
        estimate of the overall comprehension percentage that will still heavily discount
        the least frequent words.
        */
        let result = 0;

        for (let i = 1; i <= 4001; i += 1000) {
            result += f(i + wordCounts[`${i}-${i+999}`]) - f(i);
        }
        result += f(5001 + wordCounts['5000+']) - f(5001)

        return result;
    }

    useEffect(() => {
        setComprehensionPercentage(getComprehensionPercentage());
    }, [wordCounts]);

    return comprehensionPercentage;
};