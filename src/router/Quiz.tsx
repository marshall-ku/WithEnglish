import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import SelectTable from "../components/SelectTable";
import Loader from "../components/Loader";

function SpeedQuiz(props: SpeedQuizProps) {
    const { data, setData } = props;
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

    return <div></div>;
}

export default function Quiz() {
    const [list, setList] = useState<string[]>();
    const [data, setData] = useState<word[]>();

    const fetchList = () => {
        fetch("/data/list.json")
            .then((response) => {
                try {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Couldn't fetch data");
                    }
                } catch (error) {
                    throw new Error("Couldn't parse data");
                }
            })
            .then((response: string[]) => {
                setList(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (data) {
        return <SpeedQuiz data={data} setData={setData} />;
    } else if (list) {
        return <SelectTable list={list} shuffle={true} setData={setData} />;
    } else {
        return (
            <div className="center-container">
                <Loader />
            </div>
        );
    }
}
