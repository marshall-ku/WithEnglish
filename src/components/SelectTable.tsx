import React from "react";
import { shuffleArray } from "../utils";
import "./SelectTable.css";

export default function SelectTable(props: SelectTableProps) {
    const { list, shuffle, setData, setAndCheckData, setTitle } = props;

    const fetchData = (list: string) => {
        fetch(`/data/${list}.json`)
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
            .then((response: word[]) => {
                if (shuffle) {
                    shuffleArray(response);
                }

                if (setTitle) {
                    setTitle(list);
                }

                if (setData) {
                    setData(response);
                } else if (setAndCheckData) {
                    setAndCheckData(response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <ul className="select">
            {list.map((item, index) => {
                return (
                    <li
                        className="large-button"
                        onClick={() => {
                            fetchData(item);
                        }}
                        key={index}
                    >
                        {item}
                    </li>
                );
            })}
        </ul>
    );
}
