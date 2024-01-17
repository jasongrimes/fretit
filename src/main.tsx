import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// https://docs.sentry.io/platforms/javascript/configuration/
Sentry.init({
  dsn: "https://e1d04366240df9b94307e86e6ca1463c@o4506580425244672.ingest.sentry.io/4506580432781312",
  enabled: import.meta.env.PROD,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
