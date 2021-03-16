interface SelectTableProps {
    list: string[];
    shuffle?: boolean;
    removeAware?: boolean;
    setData?: React.Dispatch<React.SetStateAction<word[] | undefined>>;
    setAndCheckData?: (words: word[]) => void;
    setTitle?: React.Dispatch<React.SetStateAction<string>>;
}
