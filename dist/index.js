import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import {BrowserRouter, Route} from "../_snowpack/pkg/react-router-dom.js";
import FrontPage from "./router/FrontPage.js";
import Words from "./router/Words.js";
import Memorize from "./router/Memorize.js";
import Quiz from "./router/Quiz.js";
import "./index.css.proxy.js";
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, {
  basename: "/"
}, /* @__PURE__ */ React.createElement(Route, {
  exact: true,
  path: "/",
  component: FrontPage
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/words",
  component: Words
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/memorize",
  component: Memorize
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/quiz",
  component: Quiz
}))), document.getElementById("root"));
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
