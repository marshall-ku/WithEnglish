import React from "../../_snowpack/pkg/react.js";
import {shuffleArray} from "../utils.js";
import "./SelectTable.css.proxy.js";
export default function SelectTable(props) {
  const {list, shuffle, setData} = props;
  const fetchData = (list2) => {
    fetch(`/data/${list2}.json`).then((response) => {
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
      if (shuffle) {
        shuffleArray(response);
      }
      setData(response);
    }).catch((error) => {
      console.log(error);
    });
  };
  return /* @__PURE__ */ React.createElement("ul", {
    className: "select"
  }, list.map((item, index) => {
    return /* @__PURE__ */ React.createElement("li", {
      className: "large-button",
      onClick: () => {
        fetchData(item);
      },
      key: index
    }, item);
  }));
}
