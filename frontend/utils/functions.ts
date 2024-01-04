export const calcLevel = (n: number, tot_n: number) => {
    // Want to have increasing bucket size as n increases
    const bucket_size = Math.floor(tot_n / 100);

    const floatLevel = n / bucket_size + 1;
    const level = Math.floor(floatLevel);
    const levelResidual = floatLevel - level;

    return { level, levelResidual};
}

export const frequencyIndexToComprehensionPercentage = (n: number) => {
    // Describes the relationship between n and the percentage of a language
    // someone would know were they to know all the words between the 1st and nth
    // most frequent words in the language.
    // Ex. If someone knew the 1000 most frequently-used words in a language,
    // (n=1000), they could understand f(n) percent of the text in the corpus.
    // TODO: Pass in the custom constants for each language's corpus.
    return n == 0 ? 0 : Math.round(-83.32317585 + 191.39405783 / (1 + Math.E**(-0.39771826 * n**0.20018198)));
}