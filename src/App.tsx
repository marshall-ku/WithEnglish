import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import FrontPage from "./router/FrontPage";
import Words from "./router/Words";
import Memorize from "./router/Memorize";
import Test from "./router/Test";
import Admin from "./router/Admin";
import SignIn from "./router/SignIn";
import SignUp from "./router/SignUp";
import Navigation from "./components/Navigation";
import Loader from "./components/Loader";

export default function App() {
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

    if (!loaded) {
        return (
            <BrowserRouter basename="/">
                <Loader />
                <Navigation />
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter basename="/">
            <Route exact path={"/"} component={FrontPage} />
            <Route path={"/words"} component={Words} />
            <Route path={"/memorize"} component={Memorize} />
            <Route path={"/test"} component={Test} />
            <Route path={"/admin"} component={Admin} />
            <Route path={"/login"} component={SignIn} />
            <Route path={"/signup"} component={SignUp} />
            <Navigation />
        </BrowserRouter>
    );
}
