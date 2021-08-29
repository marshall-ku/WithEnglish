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

declare global {
    interface Window {
        user: {
            name?: string;
            isAdmin?: boolean;
        };
    }
}

export default function App() {
    const storedToken = localStorage.getItem("token");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        window.user = {};
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
                        window.user.name = response.name;

                        if (response.isAdmin) {
                            window.user.isAdmin = true;
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
                <div className="center-container">
                    <Loader />
                </div>
                {/* <Navigation /> */}
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter basename="/">
            {/* <main id="main"> */}
            <Route exact path={"/"} component={FrontPage} />
            <Route path={"/words"} component={Words} />
            <Route path={"/memorize"} component={Memorize} />
            <Route path={"/test"} component={Test} />
            <Route path={"/admin"} component={Admin} />
            <Route path={"/login"} component={SignIn} />
            <Route path={"/signup"} component={SignUp} />
            {/* </main> */}
            {/* <Navigation /> */}
        </BrowserRouter>
    );
}
