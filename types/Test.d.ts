interface SpeedQuizProps {
    data: word[];
    showCorrect: boolean;
    limit: number;
}

interface ITestResponse {
    freshToken?: string;
    limit: number;
    showCorrect: boolean;
    words: word[];
}
