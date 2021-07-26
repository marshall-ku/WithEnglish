import React, { useState, useEffect } from "react";
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
        fetch("https://api.withen.ga/test/reset", {
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
        fetch("https://api.withen.ga/users", {
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
    return (
        <>
            <h2>Words</h2>
            <WordCalendar />
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
        fetch("https://api.withen.ga/test/config/update", {
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
        fetch("https://api.withen.ga/test/config", {
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
                    <button className="small-button" onClick={postConfig}>
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
            fetch("https://api.withen.ga/auth", {
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
