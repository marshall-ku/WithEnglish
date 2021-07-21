import React, { useState, useEffect } from "react";
import Calendar, { CalendarTileProperties } from "react-calendar";
import Loader from "../components/Loader";
import { GroupIcon, BookIcon } from "../components/Icons";
import { updateToken } from "../auth";
import { toast } from "../toast";
import "./Admin.css";
import "../components/Calendar.css";

function GradeCalendar(props: GradeCalendarProps) {
    const { user } = props;
    const grades = user.grades.map((user) => {
        return {
            date: new Date(user.date),
            grade: user.grade,
        };
    });
    const [value, onChange] = useState(new Date());
    const checkIfSameDay = (day1: Date, day2: Date) => {
        return (
            day1.getDate() === day2.getDate() &&
            day1.getMonth() === day2.getMonth() &&
            day1.getFullYear() === day2.getFullYear()
        );
    };
    const Tile = (props: CalendarTileProperties) => {
        const currentDate = new Date(props.date);
        const filter = grades.filter((day) =>
            checkIfSameDay(day.date, currentDate)
        );

        console.log(filter);

        if (!filter.length) return null;

        const { grade } = filter[0];

        return <div className={grade < 80 ? "fail" : ""}>{grade}</div>;
    };

    return <Calendar onChange={onChange} value={value} tileContent={Tile} />;
}

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
                data.map((user) => {
                    return (
                        <details className="admin__user">
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
            <Loader />
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
            {category === "users" ? <MangeUsers /> : <ManageWords />}
            <nav className="admin__nav">
                <button onClick={() => setCategory("users")}>
                    <GroupIcon />
                </button>
                <button onClick={() => setCategory("words")}>
                    <BookIcon />
                </button>
            </nav>
        </div>
    );
}
