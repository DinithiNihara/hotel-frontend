import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GuestContextProvider } from "./context/GuestContext";
import { ModalProvider } from "./context/ModalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GuestContextProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </GuestContextProvider>
  </React.StrictMode>
);
