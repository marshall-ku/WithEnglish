import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import speak from "../speaker";
import Loader from "../components/Loader";
import { VolumeUpIcon, ClearIcon } from "../components/Icons";
import "./Words.css";

function WordsList(props: WordsListProps) {
    const { data } = props;

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;

        speak(target.dataset.message?.replace(/\(.*\)/, "") || "");
    };

    return (
        <div className="words">
            <div className="table">
                <div className="table__title">단어</div>
                <div className="table__title">뜻</div>
                <div className="table__title">예문</div>
                {data.map((word) => {
                    return (
                        <>
                            <div className={word.aware ? "aware" : ""}>
                                {word.word}
                                <button
                                    data-message={word.word}
                                    onClick={handleClick}
                                >
                                    <VolumeUpIcon />
                                </button>
                            </div>
                            <div>
                                {word.meaning.map((meaning) => {
                                    return <li>{meaning}</li>;
                                })}
                            </div>
                            <div>{word.example || ""}</div>
                        </>
                    );
                })}
            </div>
        </div>
    );
}

export default function Words() {
    const [data, setData] = useState<word[]>();

    const fetchWords = () => {
        fetch("https://api.withen.ga/words/today")
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

    useEffect(() => {
        fetchWords();
    }, []);

    if (data) {
        return <WordsList data={data} />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}