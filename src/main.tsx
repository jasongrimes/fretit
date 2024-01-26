import * as Sentry from "@sentry/react";
import { PostHogProvider } from "posthog-js/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

// https://docs.sentry.io/platforms/javascript/configuration/
Sentry.init({
  dsn: "https://e1d04366240df9b94307e86e6ca1463c@o4506580425244672.ingest.sentry.io/4506580432781312",
  enabled: import.meta.env.PROD,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={posthogOptions}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>,
);
