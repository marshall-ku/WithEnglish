import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import { shuffleArray } from "../utils";
import { HomeIcon } from "../components/Icons";
import { updateToken } from "../auth";
import { toast } from "../toast";

import "./Test.css";

function WordTest(props: SpeedQuizProps) {
    const {
        words,
        problems,
        answers,
        limit,
        showCorrect,
        hasIdioms,
        randomIdiom,
        idioms,
    } = props;
    const { length: dataLength } = words;
    const generateRandomNumbers = (mustHave: number) => {
        const numbers: number[] = [mustHave];
        const randomNumber = () => Math.floor(Math.random() * dataLength);
        const size = 4;

        while (numbers.length < size) {
            const number = randomNumber();

            if (
                !numbers.includes(number) &&
                !answers.has(number) &&
                words[number]
            ) {
                numbers.push(number);
            }
        }

        // Return shuffled array
        shuffleArray(numbers);
        return numbers;
    };
    const [index, setIndex] = useState<number>(0);
    const [randomNumbers, setRandomNumbers] = useState<number[]>(
        generateRandomNumbers(problems[index])
    );
    const [done, setDone] = useState(false);
    const [incorrect, setIncorrect] = useState<number>(0);
    const [animating, setAnimating] = useState(true);
    const timeLimit = 5000;
    const animationTime = showCorrect ? 1000 : 500;

    const increaseIndex = (incorrect: number) => {
        setAnimating(false);
        if (index !== limit - 1) {
            setTimeout(() => {
                document.querySelectorAll(".clicked").forEach((element) => {
                    element.classList.remove("clicked");
                });
                answers.add(problems[index + 1]);
                setRandomNumbers(generateRandomNumbers(problems[index + 1]));
                setIndex(index + 1);
                setAnimating(true);
            }, animationTime);
        } else {
            setTimeout(() => {
                setDone(true);

                fetch("https://words-api.marshall-ku.com/test/result", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({
                        grade: (((limit - incorrect) / limit) * 100).toFixed(2),
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

        const target = event.target as HTMLButtonElement;
        const submittedAnswer = target.innerText;
        const correctAnswer =
            hasIdioms && index === limit - 1
                ? idioms[randomIdiom].word
                : words[problems[index]].word;

        target.classList.add("clicked");

        if (
            submittedAnswer.toLocaleLowerCase() !==
            correctAnswer.toLocaleLowerCase()
        ) {
            increaseIndex(incorrect + 1);
            setIncorrect(incorrect + 1);
        } else {
            increaseIndex(incorrect);
        }
    };

    useEffect(() => {
        answers.add(problems[index]);
    }, []);

    useEffect(() => {
        const timer = done
            ? setTimeout(() => {}, 0)
            : setTimeout(() => {
                  increaseIndex(incorrect + 1);
                  setIncorrect(incorrect + 1);
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
                {(hasIdioms && index === limit - 1
                    ? idioms[randomIdiom]
                    : words[problems[index]]
                ).meaning.map((meaning, i) => {
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
                                !animating &&
                                showCorrect &&
                                (hasIdioms
                                    ? index === limit - 1
                                        ? i === randomIdiom
                                        : number === problems[index]
                                    : number === problems[index])
                                    ? "answer"
                                    : ""
                            }`}
                        >
                            {hasIdioms && index === limit - 1
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
    const generateRandomNumbers = (max: number, limit: number) => {
        const numbers: number[] = [];
        const randomNumber = () => Math.floor(Math.random() * max);

        while (numbers.length < limit) {
            const number = randomNumber();

            if (!numbers.includes(number)) {
                numbers.push(number);
            }
        }

        // Return shuffled array
        return numbers;
    };

    const [data, setData] = useState<word[]>();
    const [limit, setLimit] = useState(0);
    const [showCorrect, setShowCorrect] = useState<boolean>();
    const [signInRequired, setSignInRequired] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const answers: Set<number> = new Set([]);

    const fetchWords = () => {
        fetch("https://words-api.marshall-ku.com/test", {
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

        const wordsWithoutIdioms = data.filter((word) => !word.isIdiom);
        const tmpWords = wordsWithoutIdioms.filter((_, i) => i < limit);
        const tmpIdioms = data.filter((word) => word.isIdiom);
        const hasIdioms = tmpIdioms.length !== 0;
        const randomIdiom = Math.min(
            Math.floor(Math.random() * tmpIdioms.length),
            3
        );
        const idioms = !hasIdioms
            ? []
            : tmpIdioms.length < 4
            ? tmpIdioms.concat(
                  tmpWords.filter((_, i) => i < 4 - tmpIdioms.length)
              )
            : tmpIdioms;
        // const words = hasIdioms
        //     ? tmpWords
        //           .filter((_, i) => i < limit - 1)
        //           .concat(idioms[randomIdiom])
        //     : tmpWords;
        const problems = generateRandomNumbers(
            wordsWithoutIdioms.length,
            limit
        );

        return (
            <WordTest
                words={wordsWithoutIdioms}
                idioms={idioms}
                problems={problems}
                limit={limit}
                answers={answers}
                hasIdioms={hasIdioms}
                randomIdiom={randomIdiom}
                showCorrect={showCorrect}
            />
        );
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
