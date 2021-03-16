import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {Link} from "../../_snowpack/pkg/react-router-dom.js";
import SelectTable from "../components/SelectTable.js";
import {shuffleArray} from "../utils.js";
import Loader from "../components/Loader.js";
import {ListIcon, HomeIcon, RenewIcon} from "../components/Icons.js";
import "./Memorize.css.proxy.js";
function MemorizeWords(props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);
  const {data, setData} = props;
  const {length} = data;
  const wordSwapInterval = 4e3;
  const wordRevealInterval = wordSwapInterval - 1e3;
  useEffect(() => {
    const timer = index === length - 1 ? setTimeout(() => setDone(true), wordSwapInterval) : setTimeout(() => {
      setIndex(index + 1);
      setReveal(false);
    }, wordSwapInterval);
    const reveal2 = setTimeout(() => setReveal(true), wordRevealInterval);
    return () => {
      clearTimeout(timer);
      clearTimeout(reveal2);
    };
  }, [index, setIndex]);
  if (done) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "center-container done"
    }, /* @__PURE__ */ React.createElement("h2", {
      className: "done__title"
    }, "Done \u{1F389}"), /* @__PURE__ */ React.createElement("div", {
      className: "done__buttons"
    }, /* @__PURE__ */ React.createElement("button", {
      className: "done__button",
      onClick: () => setData(void 0)
    }, /* @__PURE__ */ React.createElement(ListIcon, null)), /* @__PURE__ */ React.createElement(Link, {
      className: "done__button",
      to: "/"
    }, /* @__PURE__ */ React.createElement(HomeIcon, null)), /* @__PURE__ */ React.createElement("button", {
      className: "done__button",
      onClick: () => {
        shuffleArray(data);
        setIndex(0);
        setReveal(false);
        setDone(false);
      }
    }, /* @__PURE__ */ React.createElement(RenewIcon, null))));
  } else {
    const currentWord = data[index];
    return /* @__PURE__ */ React.createElement("div", {
      className: "memorize"
    }, /* @__PURE__ */ React.createElement("h2", {
      className: "memorize__word"
    }, currentWord.word), /* @__PURE__ */ React.createElement("ol", {
      className: `memorize__meaning memorize__hidden${reveal ? " reveal" : ""}`
    }, currentWord.meaning.map((meaning, index2) => {
      return /* @__PURE__ */ React.createElement("li", {
        key: index2
      }, meaning);
    })));
  }
}
export default function Memorize() {
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
    return /* @__PURE__ */ React.createElement(MemorizeWords, {
      data,
      setData
    });
  } else if (list) {
    return /* @__PURE__ */ React.createElement(SelectTable, {
      list,
      shuffle: true,
      setData
    });
  } else {
    return /* @__PURE__ */ React.createElement("div", {
      className: "center-container"
    }, /* @__PURE__ */ React.createElement(Loader, null));
  }
}
