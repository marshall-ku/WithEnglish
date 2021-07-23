import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initToast } from "./toast";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

initToast();

window.addEventListener(
    "load",
    () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/worker.js");
        }
    },
    { once: true, passive: true }
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept();
}
