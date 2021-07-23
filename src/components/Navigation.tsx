import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { HomeIcon } from "./Icons";
import type { RouteComponentProps } from "react-router-dom";
import "./Navigation.css";

function Navigation(props: RouteComponentProps) {
    const [current, setCurrent] = useState<string>("home");

    const currentDir = (uri: string): string => {
        if (uri === "/") return "home";

        return uri.slice(1);
    };

    useEffect(() => {
        setCurrent(currentDir(props.location.pathname));
    }, [props.location.pathname]);

    return (
        <div className="gnb-container">
            <nav className={`gnb ${current}`}>
                <Link className="gnb__button gnb__button--home" to="/">
                    🏠
                </Link>
                <Link className="gnb__button gnb__button--words" to="/words">
                    📖
                </Link>
                <Link
                    className="gnb__button gnb__button--memorize"
                    to="/memorize"
                >
                    🤯
                </Link>
                <Link className="gnb__button gnb__button--test" to="/test">
                    🤔
                </Link>
            </nav>
        </div>
    );
}

export default withRouter(Navigation);
