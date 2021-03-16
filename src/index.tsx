import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import FrontPage from "./router/FrontPage";
import Words from "./router/Words";
import Memorize from "./router/Memorize";
import Quiz from "./router/Quiz";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter basename="/">
            <Route exact path={"/"} component={FrontPage} />
            <Route path={"/words"} component={Words} />
            <Route path={"/memorize"} component={Memorize} />
            <Route path={"/quiz"} component={Quiz} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept();
}
