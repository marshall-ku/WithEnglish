import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import SelectTable from "../components/SelectTable.js";
import Loader from "../components/Loader.js";
function SpeedQuiz(props) {
  const {data, setData} = props;
  const spokenWords = [];
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  useEffect(() => {
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }, []);
  return /* @__PURE__ */ React.createElement("div", null);
}
export default function Quiz() {
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
    return /* @__PURE__ */ React.createElement(SpeedQuiz, {
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
