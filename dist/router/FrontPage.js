import React from "../../_snowpack/pkg/react.js";
import {Link} from "../../_snowpack/pkg/react-router-dom.js";
import "./FrontPage.css.proxy.js";
export default function FrontPage() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "front"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "front__title"
  }, "With English"), /* @__PURE__ */ React.createElement("div", {
    className: "front__buttons"
  }, /* @__PURE__ */ React.createElement(Link, {
    className: "large-button",
    to: "/words"
  }, "\u{1F4D6} Words"), /* @__PURE__ */ React.createElement(Link, {
    className: "large-button",
    to: "/memorize"
  }, "\u{1F92F} Memorize"), /* @__PURE__ */ React.createElement(Link, {
    className: "large-button",
    to: "/quiz"
  }, "\u{1F914} Quiz")));
}
