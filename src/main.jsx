import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";

console.log("SENTRY DSN:", import.meta.env.VITE_SENTRY_DSN);
console.log("MODE:", import.meta.env.MODE);

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  });

  // временно — удалить после теста
  setTimeout(() => {
    Sentry.captureMessage("test from prod");
  }, 2000);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
