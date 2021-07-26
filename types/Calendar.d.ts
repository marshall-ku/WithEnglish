interface GradeCalendarProps {
    user: IUserWithGrade;
}

interface WordCalendarProps {
    setAdminData: React.Dispatch<React.SetStateAction<word[] | undefined>>;
    setAdminFileName: React.Dispatch<React.SetStateAction<string | undefined>>;
}
