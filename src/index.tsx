import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import FrontPage from "./router/FrontPage";
import Words from "./router/Words";
import Memorize from "./router/Memorize";
import Test from "./router/Test";
import Admin from "./router/Admin";
import SignIn from "./router/SignIn";
import SignUp from "./router/SignUp";
import "./index.css";

import { initToast } from "./toast";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter basename="/">
            <Route exact path={"/"} component={FrontPage} />
            <Route path={"/words"} component={Words} />
            <Route path={"/memorize"} component={Memorize} />
            <Route path={"/test"} component={Test} />
            <Route path={"/admin"} component={Admin} />
            <Route path={"/login"} component={SignIn} />
            <Route path={"/signup"} component={SignUp} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

initToast();

window.addEventListener(
    "load",
    () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/worker.js");
        }
    },
    { once: true, passive: true }
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept();
}
