import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import Loader from "../components/Loader";
import { ListIcon, HomeIcon } from "../components/Icons";

import "./Test.css";

function WordTest(props: SpeedQuizProps) {
    const { data, setData } = props;
    const [index, setIndex] = useState<number>(0);
    const [done, setDone] = useState(false);
    const [incorrect, setIncorrect] = useState<number>(0);
    const [start, _] = useState<number>(new Date().getTime());
    const { length } = data;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const input = target.firstChild as HTMLInputElement;
        const answer = input.value;

        if (
            answer.toLocaleLowerCase() === data[index].word.toLocaleLowerCase()
        ) {
            if (index !== length - 1) {
                setIndex(index + 1);
                input.value = "";
            } else {
                setDone(true);
            }
        } else {
            setIncorrect(incorrect + 1);
            target.classList.add("wrong");
            setTimeout(() => {
                target.classList.remove("wrong");
            }, 300);
        }
    };

    if (done) {
        return (
            <div className="center-container done">
                <h2 className="done__title">Congratulations! 🎉</h2>
                <div className="done__info">
                    <h3>
                        소요 시간 :{" "}
                        {Math.round((new Date().getTime() - start) / 1000)}초
                    </h3>
                    <h3>오답수 : {incorrect}</h3>
                </div>
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
                </div>
            </div>
        );
    }

    return (
        <div className="question">
            <ul className="question__meaning">
                {data[index].meaning.map((meaning) => {
                    return <li>{meaning}</li>;
                })}
            </ul>
            <form className="question__input-wrap" onSubmit={handleSubmit}>
                <input type="text" className="question__input" />
            </form>
        </div>
    );
}

export default function Test() {
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
        return <WordTest data={data} setData={setData} />;
    } else if (list) {
        return <SelectTable list={list} shuffle={true} setData={setData} />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
