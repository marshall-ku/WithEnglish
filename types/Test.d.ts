interface SpeedQuizProps {
    words: word[];
    problems: number[];
    answers: Set<number>;
    limit: number;
    showCorrect: boolean;
    hasIdioms: boolean;
    randomIdiom: number;
    idioms: word[];
}

interface ITestResponse {
    freshToken?: string;
    limit: number;
    showCorrect: boolean;
    words: word[];
}
