import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import { shuffleArray } from "../utils";
import { HomeIcon } from "../components/Icons";
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

    const { data, showCorrect, limit } = props;
    const tmpWords = data
        .filter((word) => !word.isIdiom)
        .filter((_, i) => i < limit);
    const tmpIdioms = data.filter((word) => word.isIdiom);
    const hasIdioms = tmpIdioms.length !== 0;
    const idioms = !hasIdioms
        ? []
        : tmpIdioms.length < 4
        ? tmpIdioms.concat(tmpWords.filter((_, i) => i < 4 - tmpIdioms.length))
        : tmpIdioms.filter((_, i) => i < 4);
    const words = hasIdioms
        ? tmpWords.filter((_, i) => i < limit - 1).concat(idioms[0])
        : tmpWords;
    const [index, setIndex] = useState<number>(0);
    const [randomNumbers, setRandomNumbers] = useState<number[]>(
        generateRandomNumbers(words.length, index)
    );
    const [done, setDone] = useState(false);
    const [incorrect, setIncorrect] = useState<number>(0);
    const [animating, setAnimating] = useState(true);
    const { length: dataLength } = words;
    const timeLimit = 5000;
    const animationTime = showCorrect ? 1000 : 500;

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
            }, animationTime);
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
                        } else {
                            toast(
                                response.message || "Something went wrong 😥"
                            );
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
            answer.toLocaleLowerCase() !== words[index].word.toLocaleLowerCase()
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
    }, [animating, index, done]);

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
        <div
            className={`question ${
                showCorrect ? "question--show-correct" : ""
            }`}
        >
            <div
                className={`question__time-limit ${
                    animating ? "animating" : ""
                }`}
            ></div>
            <ul className="question__meaning">
                {words[index].meaning.map((meaning, i) => {
                    return <li key={i}>{meaning}</li>;
                })}
            </ul>
            <ul className="question__words">
                {randomNumbers.map((number, i) => {
                    return (
                        <button
                            key={number}
                            onClick={handleSubmit}
                            className={`large-button ${
                                !animating && showCorrect && number === index
                                    ? "answer"
                                    : ""
                            }`}
                        >
                            {index === dataLength - 1 && hasIdioms
                                ? idioms[i].word
                                : words[number].word}
                        </button>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Test() {
    const [data, setData] = useState<word[]>();
    const [limit, setLimit] = useState(0);
    const [showCorrect, setShowCorrect] = useState<boolean>();
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
                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: ITestResponse | IError) => {
                if (response.hasOwnProperty("words")) {
                    response = response as ITestResponse;
                    const { words, limit, showCorrect, freshToken } = response;
                    setData(words);
                    setLimit(limit);
                    setShowCorrect(showCorrect);
                    if (freshToken) {
                        updateToken(freshToken);
                    }
                } else {
                    response = response as IError;
                    if (response.signInRequired) {
                        setSignInRequired(true);
                    } else if (response.error) {
                        toast(response.message);
                        setRedirect(true);
                    }
                }
            })
            .catch((error) => {
                console.dir(error);
            });
    };

    useEffect(() => {
        fetchWords();
    }, []);

    if (data && limit && showCorrect !== undefined) {
        shuffleArray(data);
        return <WordTest data={data} limit={limit} showCorrect={showCorrect} />;
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
