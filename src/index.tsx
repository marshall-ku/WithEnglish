import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import FrontPage from "./router/FrontPage";
import Memorize from "./router/Memorize";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Route exact path={"/"} component={FrontPage} />
            <Route path={"/memorize"} component={Memorize} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept();
}
