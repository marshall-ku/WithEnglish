import React from "../../_snowpack/pkg/react.js";
export default function Loader() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "loader"
  }, /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 200 200",
    width: "100",
    height: "100"
  }, /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "88.9",
    fill: "transparent",
    stroke: "#f5a1b1",
    strokeWidth: "10",
    strokeDasharray: "486,316.1593"
  }, /* @__PURE__ */ React.createElement("animate", {
    attributeName: "stroke",
    repeatCount: "indefinite",
    dur: "1.5s",
    values: "#f5a1b1;#a277bc;#4dd6d3;#f5a1b1",
    begin: "0s"
  }), /* @__PURE__ */ React.createElement("animate", {
    attributeName: "stroke-dasharray",
    repeatCount: "indefinite",
    dur: "1.5s",
    values: "486,316.1593;942.4778,316.1593;942.4778,316.1593",
    begin: "0s"
  }), /* @__PURE__ */ React.createElement("animate", {
    attributeName: "stroke-dashoffset",
    repeatCount: "indefinite",
    dur: "1.5s",
    values: "0;-300.5;-800",
    begin: "0s"
  })), /* @__PURE__ */ React.createElement("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    type: "rotate",
    from: "0 100 100",
    to: "360 100 100",
    dur: "1.5s",
    repeatCount: "indefinite"
  }))));
}
