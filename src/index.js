import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GuestContextProvider } from "./context/GuestContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GuestContextProvider>
      <App />
    </GuestContextProvider>
  </React.StrictMode>
);
