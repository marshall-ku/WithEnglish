import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import SelectTable from "../components/SelectTable.js";
import Loader from "../components/Loader.js";
import "./Words.css.proxy.js";
function WordsList(props) {
  const {data, setData} = props;
  return /* @__PURE__ */ React.createElement("div", {
    className: "words"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "table"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "table__title"
  }, "\uB2E8\uC5B4"), /* @__PURE__ */ React.createElement("div", {
    className: "table__title"
  }, "\uB73B"), /* @__PURE__ */ React.createElement("div", {
    className: "table__title"
  }, "\uC608\uBB38"), data.map((word) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, word.word), /* @__PURE__ */ React.createElement("div", null, word.meaning.map((meaning) => {
      return /* @__PURE__ */ React.createElement("li", null, meaning);
    })), /* @__PURE__ */ React.createElement("div", null, word.example || ""));
  })));
}
export default function Words() {
  const [list, setList] = useState();
  const [data, setData] = useState();
  const fetchList = () => {
    fetch("/data/list.json").then((response) => {
      try {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Couldn't fetch data");
        }
      } catch (error) {
        throw new Error("Couldn't parse data");
      }
    }).then((response) => {
      setList(response);
    }).catch((error) => {
      console.log(error);
    });
  };
  useEffect(() => {
    fetchList();
  }, []);
  if (data) {
    return /* @__PURE__ */ React.createElement(WordsList, {
      data,
      setData
    });
  } else if (list) {
    return /* @__PURE__ */ React.createElement(SelectTable, {
      list,
      setData
    });
  } else {
    return /* @__PURE__ */ React.createElement("div", {
      className: "center-container"
    }, /* @__PURE__ */ React.createElement(Loader, null));
  }
}
