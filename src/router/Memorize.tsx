import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import { shuffleArray } from "../utils";
import { setDB, getDB } from "../db";
import Loader from "../components/Loader";
import { ListIcon, HomeIcon, RenewIcon, DoneIcon } from "../components/Icons";

import "./Memorize.css";

const memorizedWords = new Set();

function MemorizeWords(props: MemorizeWordsProps) {
    const [index, setIndex] = useState<number>(0);
    const [done, setDone] = useState(false);
    const [reveal, setReveal] = useState(false);
    const [words, setWords] = useState<word[]>(props.data);
    const [complete, setComplete] = useState(false);

    const { setData, title } = props;
    let { length } = words;

    const wordSwapInterval = 3000;
    const wordRevealInterval = wordSwapInterval - 1000;

    const handleAware = () => {
        const { word } = words[index];

        document.documentElement.classList.add("aware");
        memorizedWords.add(word);
        console.log(word);
    };

    const handleDone = () => {
        const memorizedWordsArr = [...memorizedWords.values()];

        setDone(true);

        if (memorizedWordsArr.length) {
            memorizedWords.clear();
            setDB(title, memorizedWordsArr);
        }
    };

    useEffect(() => {
        const timer =
            index === length - 1
                ? setTimeout(() => handleDone(), wordSwapInterval)
                : setTimeout(() => {
                      setIndex(index + 1);
                      setReveal(false);
                  }, wordSwapInterval);
        const reveal = setTimeout(() => setReveal(true), wordRevealInterval);

        document.documentElement.classList.remove("aware");

        return () => {
            clearTimeout(timer);
            clearTimeout(reveal);
        };
    }, [index, setIndex]);

    if (complete) {
        return (
            <div className="center-container">
                <h2>Wow! You memorized every words!</h2>
            </div>
        );
    } else if (done) {
        return (
            <div className="center-container done">
                <h2 className="done__title">Done 🎉</h2>
                <div className="done__buttons">
                    <button
                        className="done__button"
                        onClick={() => setData(undefined)}
                    >
                        <ListIcon />
                    </button>
                    <Link className="done__button" to="/">
                        <HomeIcon />
                    </Link>
                    <button
                        className="done__button"
                        onClick={() => {
                            const stored = getDB(title);

                            if (stored) {
                                const parsed: string[] = JSON.parse(stored);
                                const wordsToStudy = words.filter((word) => {
                                    return !parsed.includes(word.word);
                                });

                                length = wordsToStudy.length;

                                if (length) {
                                    shuffleArray(wordsToStudy);
                                    setWords(wordsToStudy);
                                } else {
                                    setComplete(true);
                                }
                            } else {
                                shuffleArray(words);
                            }

                            setIndex(0);
                            setReveal(false);
                            setDone(false);
                        }}
                    >
                        <RenewIcon />
                    </button>
                </div>
            </div>
        );
    } else {
        const currentWord = words[index];

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
                <button className="memorize__aware" onClick={handleAware}>
                    <DoneIcon /> I know this
                </button>
            </div>
        );
    }
}

export default function Memorize() {
    const [list, setList] = useState<string[]>();
    const [data, setData] = useState<word[]>();
    const [title, setTitle] = useState<string>("");
    const [done, setDone] = useState(false);

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

    const setAndCheckData = (words: word[]) => {
        if (!words.length) {
            setDone(true);
        } else {
            setData(words);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (done) {
        return (
            <div className="center-container">
                <h2>Wow! You memorized every words!</h2>
            </div>
        );
    } else if (data) {
        return <MemorizeWords data={data} title={title} setData={setData} />;
    } else if (list) {
        return (
            <SelectTable
                list={list}
                shuffle={true}
                removeAware={true}
                setAndCheckData={setAndCheckData}
                setTitle={setTitle}
            />
        );
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
