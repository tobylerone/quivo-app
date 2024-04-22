export interface ISentence {
    sentence: string,
    translated_sentence: string,
    cluster?: number,
    words: JSON,
    average_count?: number,
    min_count?: number,
    average_count_rank?: number,
    min_count_rank?: number
}