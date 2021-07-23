import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {Link, withRouter} from "../../_snowpack/pkg/react-router-dom.js";
import "./Navigation.css";
function Navigation(props) {
  const [current, setCurrent] = useState("home");
  const currentDir = (uri) => {
    if (uri === "/")
      return "home";
    return uri.slice(1);
  };
  useEffect(() => {
    setCurrent(currentDir(props.location.pathname));
  }, [props.location.pathname]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "gnb-container"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: `gnb ${current}`
  }, /* @__PURE__ */ React.createElement(Link, {
    className: "gnb__button gnb__button--home",
    to: "/"
  }, "🏠"), /* @__PURE__ */ React.createElement(Link, {
    className: "gnb__button gnb__button--words",
    to: "/words"
  }, "📖"), /* @__PURE__ */ React.createElement(Link, {
    className: "gnb__button gnb__button--memorize",
    to: "/memorize"
  }, "🤯"), /* @__PURE__ */ React.createElement(Link, {
    className: "gnb__button gnb__button--test",
    to: "/test"
  }, "🤔")));
}
export default withRouter(Navigation);
