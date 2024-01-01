export const calcLevel = (n: number, tot_n: number) => {
    // Want to have increasing bucket size as n increases
    const bucket_size = Math.floor(tot_n / 100);

    const floatLevel = n / bucket_size + 1;
    const level = Math.floor(floatLevel);
    const levelResidual = floatLevel - level;

    return { level, levelResidual};
}