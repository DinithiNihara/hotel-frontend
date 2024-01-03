import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GuestContextProvider } from "./context/GuestContext";
import { ModalProvider } from "./context/ModalContext";
import { RoomContextProvider } from "./context/RoomContext";
import { EventVenueContextProvider } from "./context/EventVenueContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GuestContextProvider>
      <RoomContextProvider>
        <EventVenueContextProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </EventVenueContextProvider>
      </RoomContextProvider>
    </GuestContextProvider>
  </React.StrictMode>
);
