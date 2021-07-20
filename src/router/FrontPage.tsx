import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FrontPage.css";

export default function FrontPage() {
    const storedToken = localStorage.getItem("token");
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
                });
        }
    }, []);

    return (
        <div className="front">
            <h1 className="front__title">With English</h1>
            <div className="front__buttons">
                <Link className="large-button" to="/words">
                    📖 Words
                </Link>
                <Link className="large-button" to="/memorize">
                    🤯 Memorize
                </Link>
                <Link className="large-button" to="/test">
                    🤔 Test
                </Link>
            </div>
            <footer>
                {name ? (
                    isAdmin ? (
                        <div>
                            Welcome, <Link to="/admin">{name}</Link>
                        </div>
                    ) : (
                        <div>Welcome, {name}</div>
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
