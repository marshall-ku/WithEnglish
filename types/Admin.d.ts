interface IUserWithGrade {
    name: string;
    grades: {
        date: string;
        grade: number;
    }[];
}

interface GradeCalendarProps {
    user: IUserWithGrade;
}
