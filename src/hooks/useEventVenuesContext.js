import { useContext } from "react";
import { EventVenueContext } from "../context/EventVenueContext";

export const useEventVenuesContext = () => {
  const context = useContext(EventVenueContext);

  if (!context) {
    throw Error("useEventVenuesContext must be used inside an EventVenueContextProvider");
  }

  return context;
};
