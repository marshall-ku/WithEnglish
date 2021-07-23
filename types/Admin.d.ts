interface IUserWithGrade {
    name: string;
    lastTestDate: string;
    grades: {
        date: string;
        grade: number;
    }[];
}

interface GradeCalendarProps {
    user: IUserWithGrade;
}

interface IWordsDirResponse {
    error?: boolean;
    message?: string;
    words?: string[];
}
