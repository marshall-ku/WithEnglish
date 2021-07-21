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
