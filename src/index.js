import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserContextProvider } from "./context/UserContext";
import { GuestContextProvider } from "./context/GuestContext";
import { ModalProvider } from "./context/ModalContext";
import { RoomContextProvider } from "./context/RoomContext";
import { EventVenueContextProvider } from "./context/EventVenueContext";
import { RoomReservationProvider } from "./context/RoomReservationDataContext";
import { EventVenueReservationProvider } from "./context/EventVenueReservationDataContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider>
        <UserContextProvider>
          <GuestContextProvider>
            <RoomContextProvider>
              <EventVenueContextProvider>
                <RoomReservationProvider>
                  <EventVenueReservationProvider>
                    <ModalProvider>
                      <App />
                    </ModalProvider>
                  </EventVenueReservationProvider>
                </RoomReservationProvider>
              </EventVenueContextProvider>
            </RoomContextProvider>
          </GuestContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
