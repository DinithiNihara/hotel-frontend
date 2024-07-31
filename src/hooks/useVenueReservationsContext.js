import { useContext } from "react";
import { EventVenueReservationDataContext } from "../context/EventVenueReservationDataContext";

export const useVenueReservationsContext = () => {
  const context = useContext(EventVenueReservationDataContext);

  if (!context) {
    throw Error(
      "useVenueReservationsContext must be used inside an EventVenueReservationProvider"
    );
  }

  return context;
};
