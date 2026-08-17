import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupI18n } from "./i18n";

setupI18n();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
