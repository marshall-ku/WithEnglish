import React, { useState, useEffect, useRef } from "react";
import Calendar, { CalendarTileProperties } from "react-calendar";
import Loader from "../components/Loader";
import { GradeCalendar, WordCalendar } from "../components/Calendar";
import { GroupIcon, BookIcon, BorderColorIcon } from "../components/Icons";
import { updateToken } from "../auth";
import { toast } from "../toast";
import "./Admin.css";

function MangeUsers() {
    const [data, setData] = useState<IUserWithGrade[]>();
    const resetLastTestDate = (targetUserName: string) => {
        fetch("https://words-api.marshall-ku.com/test/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
                name: targetUserName,
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
                        toast(response.message);
                    } else {
                        toast("Something went wrong 😥");
                    }
                } else {
                    toast(response.message || "Something went wrong 😥");
                }
            });
    };

    useEffect(() => {
        fetch("https://words-api.marshall-ku.com/users", {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch");
                }
            })
            .then((response) => {
                if (Array.isArray(response) && response.length) {
                    setData(response);
                }
            })
            .catch((error) => {
                console.dir(error);
            });
    }, []);

    return (
        <>
            <h2>Users</h2>
            {data ? (
                data.map((user, i) => {
                    return (
                        <details key={i} className="admin__user">
                            <summary>{user.name}</summary>
                            <div className="admin__user__container">
                                <h2>Last Tested</h2>
                                <div className="admin__user__last-test">
                                    <div>{user.lastTestDate}</div>
                                    <button
                                        className="small-button"
                                        onClick={() =>
                                            resetLastTestDate(user.name)
                                        }
                                    >
                                        Reset
                                    </button>
                                </div>
                                <h2>Grades</h2>
                                <GradeCalendar user={user} />
                            </div>
                        </details>
                    );
                })
            ) : (
                <Loader />
            )}
        </>
    );
}

function ManageWords() {
    const [data, setData] = useState<word[]>();
    const [fileName, setFileName] = useState<string>();
    const [includeExample, setIncludeExample] = useState(false);
    const textarea = useRef<HTMLTextAreaElement>(null);
    const parseWords = () => {
        if (!textarea.current) return;
        textarea.current.value = "";
        autoGrow();
        if (!data || !data.length) return;
        let string = "";
        const length = data.length;

        data.forEach((word, i) => {
            let meaning = "";

            if (word.meaning.length === 1) {
                meaning = word.meaning[0];
            } else {
                const meaningLength = word.meaning.length;

                word.meaning.forEach((string, i) => {
                    meaning += `${string}${i === meaningLength - 1 ? "" : "."}`;
                });
            }

            string += `${word.word}${word.isIdiom ? "!" : ""}\n${meaning}${
                word.example ? `\n${word.example}` : ""
            }${i === length - 1 ? "" : "\n"}`;
        });

        textarea.current.value = string;
        autoGrow();
    };
    const submitWords = () => {
        if (!textarea.current) return;

        const split = textarea.current.value.split("\n");
        const tmpWords: word[] = [];
        let tmpWord: word = includeExample
            ? {
                  word: "",
                  meaning: [""],
                  example: "",
              }
            : {
                  word: "",
                  meaning: [""],
              };

        if (includeExample) {
            split.forEach((string, i) => {
                if ((i + 1) % 3 === 0) {
                    tmpWord.example = string;
                    tmpWords.push(tmpWord);
                    tmpWord = {
                        word: "",
                        meaning: [""],
                        example: "",
                    };
                } else if ((i + 1) % 3 === 1) {
                    if (string.endsWith("!")) {
                        tmpWord.isIdiom = true;
                    }
                    tmpWord.word = string.replace("!", "");
                } else {
                    tmpWord.meaning = string
                        .split(".")
                        .map((string) => string.trim());
                }
            });
        } else {
            split.forEach((string, i) => {
                if ((i + 1) % 2 === 0) {
                    tmpWord.meaning = string
                        .split(".")
                        .map((string) => string.trim());
                    tmpWords.push(tmpWord);
                    tmpWord = {
                        word: "",
                        meaning: [""],
                    };
                } else {
                    if (string.endsWith("!")) {
                        tmpWord.isIdiom = true;
                    }
                    tmpWord.word = string.replace("!", "");
                }
            });
        }

        setData(tmpWords);

        fetch("https://words-api.marshall-ku.com/words/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
                name: fileName,
                words: tmpWords,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Failed to fetch");
            })
            .then((response) => {
                if (response.freshToken) {
                    updateToken(response.freshToken);
                }

                if (!response.error) {
                    if (response.success) {
                        toast(response.message);
                    } else {
                        toast("Something went wrong 😥");
                    }
                } else {
                    toast(response.message || "Something went wrong 😥");
                }
            });
    };
    const autoGrow = () => {
        const { current } = textarea;
        if (!current) return;
        const numberOfLineBreaks =
            (current.value.match(/\n/g) || []).length + 1;
        // min-height + lines x line-height + padding + border
        const newHeight = numberOfLineBreaks * 32 + 20 + 0;

        current.style.height = `${newHeight < 180 ? 180 : newHeight}px`;
    };

    useEffect(parseWords, [data]);

    return (
        <>
            <h2>Words</h2>
            <WordCalendar
                setAdminData={setData}
                setAdminFileName={setFileName}
            />
            <div>
                <input
                    type="checkbox"
                    id="include-example"
                    onChange={(event) => {
                        setIncludeExample(event.target.checked);
                    }}
                />
                <label htmlFor="include-example">예문 포함</label>
            </div>
            <textarea
                placeholder="영단어, 뜻 순으로 입력&#13;&#10;뜻 여러개인 단어는 .으로 뜻 구분&#13;&#10;숙어면 영단어 마지막에 ! 추가"
                cols={30}
                rows={5}
                ref={textarea}
                onKeyUp={autoGrow}
                onChange={autoGrow}
            ></textarea>
            <button className="large-button" onClick={submitWords}>
                Submit
            </button>
        </>
    );
}

function ManageTest() {
    const [showCorrect, setShowCorrect] = useState(true);
    const [limit, setLimit] = useState(10);

    const handleShowCorrectChange = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        setShowCorrect(target.checked);
        console.log(target.checked);
    };

    const handleLimitChange = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        setLimit(+target.value);
        console.log(target.value, limit);
    };

    const postConfig = () => {
        fetch("https://words-api.marshall-ku.com/test/config/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("token") || "",
            },
            body: JSON.stringify({
                limit,
                showCorrect,
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
                        toast(response.message);
                    } else {
                        toast("Something went wrong 😥");
                    }
                } else {
                    toast(response.message || "Something went wrong 😥");
                }
            });
    };

    useEffect(() => {
        fetch("https://words-api.marshall-ku.com/test/config", {
            headers: {
                "x-auth-token": localStorage.getItem("token") || "",
            },
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
                        setShowCorrect(response.showCorrect);
                        setLimit(response.limit);
                    } else {
                        toast("Something went wrong 😥");
                    }
                } else {
                    toast(response.message || "Something went wrong 😥");
                }
            });
    }, []);

    return (
        <>
            <h2>Test</h2>
            <div className="admin__options">
                <h3>Display the correct answer onclick</h3>
                <div>
                    <input
                        type="checkbox"
                        checked={showCorrect}
                        onChange={handleShowCorrectChange}
                        id="showCorrect"
                    />
                    <label htmlFor="showCorrect">
                        {showCorrect ? "👀 True" : "😑 False"}
                    </label>
                </div>
                <h3>The number of words for test</h3>
                <div>
                    <input
                        type="number"
                        value={limit}
                        onChange={handleLimitChange}
                    />
                </div>
                <div>
                    <button className="large-button" onClick={postConfig}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}

export default function Admin() {
    const storedToken = localStorage.getItem("token");
    const [isAdmin, setIsAdmin] = useState(false);
    const [category, setCategory] = useState("users");

    useEffect(() => {
        if (storedToken) {
            fetch("https://words-api.marshall-ku.com/auth", {
                method: "GET",
                headers: {
                    "x-auth-token": storedToken,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch");
                    }
                })
                .then((response) => {
                    if (response.success) {
                        if (response.isAdmin) {
                            setIsAdmin(true);
                        }
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        }
    }, []);

    if (!isAdmin) return null;

    return (
        <div className={`admin admin--${category}`}>
            {category === "users" ? (
                <MangeUsers />
            ) : category === "words" ? (
                <ManageWords />
            ) : (
                <ManageTest />
            )}
            <nav className="admin__nav">
                <button onClick={() => setCategory("users")}>
                    <GroupIcon />
                </button>
                <button onClick={() => setCategory("words")}>
                    <BookIcon />
                </button>
                <button onClick={() => setCategory("test")}>
                    <BorderColorIcon />
                </button>
            </nav>
        </div>
    );
}
