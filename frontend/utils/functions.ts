export const calcLevelOrig = (n: number, tot_n: number) => {

    const wordsInLevel = Math.floor(tot_n / 100);

    const floatLevel = n / wordsInLevel;
    let level = Math.floor(floatLevel);
    const levelResidual = floatLevel - level;
    const knownWordsInLevel = n - (level * wordsInLevel);
    // Level should start at 1 not 0
    level = level + 1;

    return { level, levelResidual, wordsInLevel, knownWordsInLevel};
}

export const calcLevel = (n: number, tot_n: number) => {

    function findLastSmallerIndex(arr, n) {
        // Given an increasing array of numbers, use binary search
        // to find the index of the last number that is smaller than
        // n
        let left = 0;
        let right = arr.length - 1;
        let result = -1; // Initialize with an invalid index
    
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
    
            if (arr[mid] < n) {
                // Update result and search right half
                result = mid;
                left = mid + 1;
            } else {
                // Search left half
                right = mid - 1;
            }
        }
    
        return result;
    }
    
    // I shouldn't be generating the buckets each time. Should do this when language changes and store
    const {buckets, cumBuckets} = generateBuckets(tot_n, 100, 50);
    
    //level is the index of the
    const levelIdx = findLastSmallerIndex(cumBuckets, n) + 1;
    const knownWordsInLevel = n - (levelIdx == 0 ? 0 : cumBuckets[levelIdx - 1]);
    const wordsInLevel = buckets[levelIdx];
    
    // Actual level is one more than the index
    const level = levelIdx + 1;

    return { level, wordsInLevel, knownWordsInLevel};
}

export const frequencyIndexToComprehensionPercentage = (n: number, coeffs: string[]) => {
    // Describes the relationship between n and the percentage of a language
    // someone would know were they to know all the words between the 1st and nth
    // most frequent words in the language.
    // Ex. If someone knew the 1000 most frequently-used words in a language,
    // (n=1000), they could understand f(n) percent of the text in the corpus.
    // TODO: Pass in the custom constants for each language's corpus.
    const floatCoeffs = coeffs.map(item => parseFloat(item));
    //return n == 0 ? 0 : Math.round(floatCoeffs[0] + floatCoeffs[1] / (1 + Math.E**(floatCoeffs[2] * n**floatCoeffs[3])));
    return n == 0 ? 0 : Math.round(-83.32317585 + 191.39405783 / (1 + Math.E**(-0.39771826 * n**0.20018198)));
}

export const sumWordCounts = (wordCounts: Record<string, number>) => {
    return Object.values(wordCounts).reduce((a, b) => a + b, 0)
}

export const generateBuckets = (nCorpus: number, nBuckets: number, firstTerm: number) => {
    /* Given the number of words in the corpus, I want to generate buckets
    that will allow me to assign a level to the user. I want the buckets to be smaller
    at the start and increase as the user progresses, so it will have to be modelled as
    a geometric series with a common ratio, r, making sure that the sum of all words in all
    levels is still equal to S).

    The easiest way to do this is by modelling the sum of bucket sizes as:

    bucket size = a * r^n

    where S = unique words in corpus
    a = first term
    r = common ratio (need to find)
    n = number of levels
    
    The sum of all terms is:
    
    S = a * ((1 - r^n)/(1-r))

    since:

    S = a + ar + ar^2 + ... + ar^n-1
    rS = ar + ar^2 + ar^3 + ... ar^n
    S - rS = a - ar^n
    S = a(1-r^n)/(1-r)

    An appropriate value of r can be found by choosing an initial guess
    and using binary search to step closer to the correct value, until
    we find an r that generates an S within a chosen tolerance of the
    total words in the corpus.

    Then this r can be used in the first equation to generate the bucket
    sizes.
    */

    let a = firstTerm;
    let r = 1.01;  // Initial guess
    let epsilon = 0.00001;  // Tolerance for value of r

    // Use binary search to find r
    let low = 1, high = 2; // Can probably reduce the high value

    while (high - low > epsilon) {
        r = (low + high) / 2;
        let sum = a * (1 - Math.pow(r, nBuckets)) / (1 - r);
        if (sum > nCorpus) {
            high = r;
        } else {
            low = r;
        }
    }

    // Generate the buckets now an appropriate r has been found
    let buckets = [];
    let bucketSize = a;
    for (let i = 0; i < nBuckets; i++) {
        buckets.push(Math.round(bucketSize));
        bucketSize *= r;
    }

    // Compare sum of buckets to nCorpus
    const bucketSum = buckets.reduce((a, b) => a + b, 0);
    const outstanding = nCorpus - bucketSum;
    
    //add/subtract difference to final level bucket size
    buckets[buckets.length - 1] += outstanding;

    // Get the cumulative size of all buckets
    const cumBuckets = buckets.map((sum => value => sum += value)(0));

    return {buckets, cumBuckets};
}