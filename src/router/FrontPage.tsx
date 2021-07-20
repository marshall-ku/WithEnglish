import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FrontPage.css";

export default function FrontPage() {
    const storedToken = localStorage.getItem("token");
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

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
                        setName(response.name);

                        if (response.isAdmin) {
                            setIsAdmin(true);
                        }
                    }
                })
                .catch((error) => {
                    console.dir(error);
                })
                .finally(() => setLoaded(true));
        } else {
            setLoaded(true);
        }
    }, []);

    return (
        <div className="front">
            <h1 className="front__title">With English</h1>
            <div className="front__buttons">
                <Link className="large-button large-button--fancy" to="/words">
                    📖 Words
                </Link>
                <Link
                    className="large-button large-button--fancy"
                    to="/memorize"
                >
                    🤯 Memorize
                </Link>
                <Link className="large-button large-button--fancy" to="/test">
                    🤔 Test
                </Link>
            </div>
            <footer
                className={loaded ? "front__footer loaded" : "front__footer"}
            >
                {name ? (
                    isAdmin ? (
                        <div>
                            Welcome,{" "}
                            <Link to="/admin">
                                <b>{name}</b>
                            </Link>
                            !
                        </div>
                    ) : (
                        <div>
                            Welcome, <b>{name}</b>!
                        </div>
                    )
                ) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <span> · </span>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </footer>
        </div>
    );
}
