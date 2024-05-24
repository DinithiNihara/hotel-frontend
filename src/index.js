import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GuestContextProvider } from "./context/GuestContext";
import { ModalProvider } from "./context/ModalContext";
import { RoomContextProvider } from "./context/RoomContext";
import { EventVenueContextProvider } from "./context/EventVenueContext";
import { RoomReservationProvider } from "./context/RoomReservationDataContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GuestContextProvider>
        <RoomContextProvider>
          <EventVenueContextProvider>
            <RoomReservationProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </RoomReservationProvider>
          </EventVenueContextProvider>
        </RoomContextProvider>
      </GuestContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
