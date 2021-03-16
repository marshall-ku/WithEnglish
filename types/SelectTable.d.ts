interface SelectTableProps {
    list: string[];
    shuffle?: boolean;
    setData: React.Dispatch<React.SetStateAction<word[] | undefined>>;
}
