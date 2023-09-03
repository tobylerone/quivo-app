
export type Difficulty = "easy" | "normal" | "hard"
export type SequenceType = "exercise" | "strech" | "break"


export interface Workout {
    slug: string,
    name: string,
    duration: number,
    difficulty: Difficulty,
    sequence: Array <SequenceItem>
}

export interface SequenceItem {
    slug: string,
    name: string,
    type: SequenceType,
    duration: number,
    reps?: number

}