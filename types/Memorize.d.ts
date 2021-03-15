interface MemorizeWordsProps {
    data: word[];
}

interface SelectTableProps {
    list: string[];
    setData: React.Dispatch<React.SetStateAction<word[] | undefined>>;
}
