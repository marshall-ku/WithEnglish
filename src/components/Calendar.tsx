import React, { useState, useEffect } from "react";
import Calendar, { CalendarTileProperties } from "react-calendar";
import "./Calendar.css";

export function GradeCalendar(props: GradeCalendarProps) {
    const { user } = props;
    const grades = user.grades.map((user) => {
        return {
            date: new Date(user.date),
            grade: user.grade,
        };
    });
    const [value, onChange] = useState(new Date());
    const checkIfSameDay = (day1: Date, day2: Date) => {
        return (
            day1.getDate() === day2.getDate() &&
            day1.getMonth() === day2.getMonth() &&
            day1.getFullYear() === day2.getFullYear()
        );
    };
    const Tile = (props: CalendarTileProperties) => {
        const currentDate = new Date(props.date);
        const filter = grades.filter((day) =>
            checkIfSameDay(day.date, currentDate)
        );

        if (!filter.length) return null;

        const { grade } = filter[0];

        return <div className={grade < 80 ? "fail" : ""}>{grade}</div>;
    };

    return <Calendar onChange={onChange} value={value} tileContent={Tile} />;
}

export function WordCalendar(props: WordCalendarProps) {
    const { setAdminData, setAdminFileName } = props;
    const [value, onChange] = useState(new Date());
    const [date, setDate] = useState(value);
    const [data, setData] = useState<Date[]>([]);
    const checkIfSameDay = (day1: Date, day2: Date) => {
        return (
            day1.getDate() === day2.getDate() &&
            day1.getMonth() === day2.getMonth() &&
            day1.getFullYear() === day2.getFullYear()
        );
    };
    const Tile = (props: CalendarTileProperties) => {
        const currentDate = new Date(props.date);
        const filter = data.filter((day) => checkIfSameDay(day, currentDate));

        if (!filter.length) return null;

        return <div>*</div>;
    };
    const fetchDir = () => {
        fetch(
            `https://api.withen.ga/words/${date.getFullYear()}/${
                date.getMonth() + 1
            }`
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Failed to fetch");
            })
            .then((response: IWordsDirResponse) => {
                if (!response.error && response.words) {
                    setData(
                        response.words.map(
                            (fileName) =>
                                new Date(
                                    `${date.getFullYear()}/${
                                        date.getMonth() + 1
                                    }/${fileName.replace(".json", "")}`
                                )
                        )
                    );
                }
            })
            .catch((error) => {
                console.dir(error);
            });
    };
    const fetchFile = () => {
        const fileName = `${value.getFullYear()}/${
            value.getMonth() + 1
        }/${value.getDate()}.json`;

        fetch(`https://api.withen.ga/words/${fileName}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error("Failed to fetch");
            })
            .then((response: word[] | IError) => {
                if (Array.isArray(response)) {
                    setAdminData(response);
                    setAdminFileName(fileName);
                } else {
                    setAdminData(undefined);
                    setAdminFileName(fileName);
                }
            })
            .catch((error) => {
                console.dir(error);
            });
    };

    useEffect(fetchDir, [date]);
    useEffect(fetchFile, [value]);

    return (
        <Calendar
            onChange={onChange}
            onActiveStartDateChange={({ activeStartDate }) =>
                setDate(new Date(activeStartDate))
            }
            value={value}
            tileContent={Tile}
        />
    );
}
