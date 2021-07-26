import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { updateToken } from "../auth";
import { toast } from "../toast";
import "./Sign.css";

export default function SignIn() {
    const [authenticated, setAuthenticated] = useState(false);
    const name = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetch("https://api.withen.ga/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.current?.value,
                password: password.current?.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Failed to fetch");
            })
            .then((response) => {
                if (response.success) {
                    if (response.token) {
                        updateToken(response.token);
                    }

                    window.user.name = response.name;

                    if (window.user.isAdmin) {
                        window.user.isAdmin = true;
                    }

                    setAuthenticated(true);
                } else {
                    toast("Something went wrong 😥");
                }
            });
    };

    if (!authenticated) {
        return (
            <form
                action="https://api.withen.ga/auth/login"
                method="post"
                className="sign sign--in"
                onSubmit={handleSubmit}
            >
                <h1>Welcome Back!</h1>
                <label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required={true}
                        ref={name}
                    />
                    <span>Name</span>
                </label>
                <label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required={true}
                        ref={password}
                    />
                    <span>Password</span>
                </label>
                <div>
                    <button type="submit" className="sign__submit">
                        Log in
                    </button>
                </div>
            </form>
        );
    }

    return <Redirect to="/" />;
}
