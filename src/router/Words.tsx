import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import speak from "../components/speaker";
import Loader from "../components/Loader";
import { VolumeUpIcon } from "../components/Icons";
import "./Words.css";

function WordsList(props: WordsListProps) {
    const { data, setData } = props;

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;

        console.log("hi");
        console.log(target);
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
                            <div>
                                {word.word}
                                <button
                                    className=""
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
        return <WordsList data={data} setData={setData} />;
    } else if (list) {
        return <SelectTable list={list} setData={setData} />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
