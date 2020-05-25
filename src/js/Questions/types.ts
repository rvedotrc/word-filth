interface ResultHistory {
    timestamp: number;
    isCorrect: boolean;
}

interface Result {
    level: number;
    history: ResultHistory[];
    nextTimestamp: number | undefined;
}
