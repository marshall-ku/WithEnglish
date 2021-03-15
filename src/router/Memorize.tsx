import React, { useState, useEffect } from "react";
import "./Memorize.css";

function MemorizeWords(props: MemorizeWordsProps) {
    const [index, setIndex] = useState<number>(0);
    const [done, setDone] = useState(false);
    const [reveal, setReveal] = useState(false);

    const { data } = props;
    const { length } = data;
    const wordSwapInterval = 4000;
    const wordRevealInterval = wordSwapInterval - 1000;

    useEffect(() => {
        console.log(index, length);
        const timer =
            index === length - 1
                ? setTimeout(() => setDone(true), wordSwapInterval)
                : setTimeout(() => {
                      setIndex(index + 1);
                      setReveal(false);
                  }, wordSwapInterval);
        const reveal = setTimeout(() => setReveal(true), wordRevealInterval);

        return () => {
            clearTimeout(timer);
            clearTimeout(reveal);
        };
    }, [index, setIndex]);

    if (done) {
        return <h2>Done</h2>;
    } else {
        const currentWord = data[index];
        return (
            <div className="memorize">
                <h2 className="memorize__word">{currentWord.word}</h2>
                <ol
                    className={`memorize__meaning memorize__hidden${
                        reveal ? " reveal" : ""
                    }`}
                >
                    {currentWord.meaning.map((meaning, index) => {
                        return <li key={index}>{meaning}</li>;
                    })}
                </ol>
            </div>
        );
    }
}

function SelectTable(props: SelectTableProps) {
    const { list, setData } = props;

    const fetchData = (list: string) => {
        fetch(`/data/${list}.json`)
            .then((response) => {
                try {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: word[]) => {
                setData(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <ul>
            {list.map((item, index) => {
                return (
                    <li
                        onClick={() => {
                            fetchData(item);
                        }}
                        key={index}
                    >
                        {item}
                    </li>
                );
            })}
        </ul>
    );
}

export default function Memorize() {
    const [list, setList] = useState<string[]>();
    const [data, setData] = useState<word[]>();

    const fetchList = () => {
        fetch("/data/list.json")
            .then((response) => {
                try {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: string[]) => {
                setList(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (data) {
        return <MemorizeWords data={data} />;
    } else if (list) {
        return <SelectTable list={list} setData={setData} />;
    } else {
        return <div>Loading...</div>;
    }
}
