import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { GradeCalendar } from "../components/Calendar";
import Loader from "../components/Loader";
import { resetToken } from "../auth";
import "./FrontPage.css";

export default function FrontPage() {
    const history = useHistory();
    const [user, setUser] = useState<IUserWithGrade>();
    const { name, isAdmin } = window.user;

    if (!name) {
        return (
            <div className="front">
                <h1 className="front__title">With English</h1>
                <div className="front__buttons">
                    <Link
                        className="large-button large-button--fancy"
                        to="/login"
                    >
                        Log In
                    </Link>
                    <Link
                        className="large-button large-button--fancy"
                        to="/signup"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (name) {
            fetch(`https://words-api.marshall-ku.com/users/user/${name}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch");
                    }
                })
                .then((response) => {
                    if (response.name && response.grades) {
                        setUser(response);
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        }
    }, []);

    return (
        <div className="front front--user">
            <div className="front__banner">
                <div className="front__banner__content">
                    <div className="profile">
                        <img src="/logo/logo-96x96.png" alt={name} />
                    </div>
                    <h1 className={isAdmin ? "admin" : ""}>{name}</h1>
                </div>
                <svg
                    className="curve curve--top"
                    width="100%"
                    height="50"
                    viewBox="0 0 200 45.68"
                    preserveAspectRatio="none"
                >
                    <path d="M0,8C33.65-10.84,50.37,29.77,68.88,29.77S117.26,0,149.26,0,200,25.55,200,25.55V45.68H0Z"></path>
                </svg>
            </div>
            {user ? (
                <div className="front__board">
                    <div className="front__board__nav">
                        {isAdmin && (
                            <Link
                                className="large-button large-button--fancy"
                                to="/admin"
                            >
                                🚧 Admin
                            </Link>
                        )}
                        <Link
                            className="large-button large-button--fancy"
                            to="/words"
                        >
                            📖 Words
                        </Link>
                        <Link
                            className="large-button large-button--fancy"
                            to="/memorize"
                        >
                            🤯 Memorize
                        </Link>
                        <Link
                            className="large-button large-button--fancy"
                            to="/test"
                        >
                            🤔 Test
                        </Link>
                    </div>
                    <h2>🗓️ Last tested</h2>
                    <div>{user.lastTestDate || "Never"}</div>
                    <h2>💡 Grades</h2>
                    <GradeCalendar user={user} />
                    <div className="front__small-text">
                        <button
                            onClick={() => {
                                resetToken();
                                history.push("/login");
                            }}
                            className="small-button"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="front__loading">
                    <Loader />
                </div>
            )}
        </div>
    );
}
