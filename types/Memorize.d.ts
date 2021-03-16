interface MemorizeWordsProps {
    data: word[];
    title: string;
    setData: React.Dispatch<React.SetStateAction<word[] | undefined>>;
}
