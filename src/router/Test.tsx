import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import { shuffleArray } from "../utils";
import { ListIcon, HomeIcon } from "../components/Icons";
import { updateToken } from "../auth";
import { toast } from "../toast";

import "./Test.css";

function WordTest(props: SpeedQuizProps) {
    const generateRandomNumbers = (max: number, mustHave: number) => {
        const numbers: number[] = [mustHave];
        const randomNumber = () => Math.floor(Math.random() * max);
        const size = 4;

        while (numbers.length < size) {
            const number = randomNumber();

            if (!numbers.includes(number)) {
                numbers.push(number);
            }
        }

        // Return shuffled array
        shuffleArray(numbers);
        return numbers;
    };

    const { data } = props;
    const [index, setIndex] = useState<number>(0);
    const [randomNumbers, setRandomNumbers] = useState<number[]>(
        generateRandomNumbers(data.length, index)
    );
    const [done, setDone] = useState(false);
    const [incorrect, setIncorrect] = useState<number>(0);
    const [animating, setAnimating] = useState(true);
    const { length: dataLength } = data;
    const timeLimit = 5000;

    const increaseIndex = () => {
        setAnimating(false);
        if (index !== dataLength - 1) {
            setTimeout(() => {
                document.querySelectorAll(".clicked").forEach((element) => {
                    element.classList.remove("clicked");
                });
                setRandomNumbers(generateRandomNumbers(dataLength, index + 1));
                setIndex(index + 1);
                setAnimating(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setDone(true);

                fetch("https://api.withen.ga/test/result", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({
                        grade: (
                            ((dataLength - incorrect) / dataLength) *
                            100
                        ).toFixed(2),
                    }),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }

                        throw new Error("Failed to fetch");
                    })
                    .then((response) => {
                        if (!response.error) {
                            if (response.freshToken) {
                                updateToken(response.freshToken);
                            }

                            if (response.success) {
                                toast("Successfully submitted 🎉");
                            } else {
                                toast("Something went wrong 😥");
                            }
                        }
                    });
            }, 1000);
        }
    };

    const handleSubmit = (event: React.MouseEvent) => {
        event.preventDefault();

        if (!animating) return;

        const target = event.target as HTMLFormElement;
        const answer = target.innerText;

        target.classList.add("clicked");

        if (
            answer.toLocaleLowerCase() !== data[index].word.toLocaleLowerCase()
        ) {
            setIncorrect(incorrect + 1);
        }

        increaseIndex();
    };

    useEffect(() => {
        const timer = done
            ? setTimeout(() => {}, 0)
            : setTimeout(() => {
                  setIncorrect(incorrect + 1);
                  increaseIndex();
              }, timeLimit);

        return () => {
            clearTimeout(timer);
        };
    }, [index, done]);

    if (done) {
        return (
            <div className="center-container done">
                <h2 className="done__title">Congratulations! 🎉</h2>
                <div className="done__info">
                    <h3>오답수 : {incorrect}</h3>
                </div>
                <div className="done__buttons">
                    <Link className="done__button" to="/">
                        <HomeIcon />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="question">
            <div
                className={`question__time-limit ${
                    animating ? "animating" : ""
                }`}
            ></div>
            <ul className="question__meaning">
                {data[index].meaning.map((meaning, i) => {
                    return <li key={i}>{meaning}</li>;
                })}
            </ul>
            <ul className="question__words">
                {randomNumbers.map((number) => {
                    return (
                        <button
                            key={number}
                            onClick={handleSubmit}
                            className={`large-button ${
                                !animating && number === index ? "answer" : ""
                            }`}
                        >
                            {data[number].word}
                        </button>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Test() {
    const [data, setData] = useState<word[]>();
    const [signInRequired, setSignInRequired] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const fetchWords = () => {
        fetch("https://api.withen.ga/test", {
            headers: {
                "x-auth-token": localStorage.getItem("token") || "",
            },
        })
            .then((response) => {
                try {
                    if (response.ok) {
                        const freshToken = response.headers.get(
                            "X-Fresh-Token"
                        );

                        if (freshToken) {
                            updateToken(freshToken);
                        }

                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: word[] | IError) => {
                if (Array.isArray(response)) {
                    setData(response);
                } else {
                    if (response.signInRequired) {
                        setSignInRequired(true);
                    } else if (response.error) {
                        toast(response.message);
                        setRedirect(true);
                    }
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchWords();
    }, []);

    if (data) {
        return <WordTest data={data} />;
    }

    if (signInRequired) {
        return <Redirect to="/login" />;
    } else if (redirect) {
        return <Redirect to="/" />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
