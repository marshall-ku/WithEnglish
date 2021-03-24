import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import "./FrontPage.css";

export default function FrontPage() {
    return (
        <div className="front">
            <h1 className="front__title">With English</h1>
            <div className="front__buttons">
                <Link className="large-button" to="/words">
                    📖 Words
                </Link>
                <Link className="large-button" to="/memorize">
                    🤯 Memorize
                </Link>
                <Link className="large-button" to="/test">
                    🤔 Test
                </Link>
            </div>
        </div>
    );
}
