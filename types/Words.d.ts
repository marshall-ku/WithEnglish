interface WordsListProps {
    data: word[];
    title: string;
    setData: React.Dispatch<React.SetStateAction<word[] | undefined>>;
}
