import { createContext, useReducer } from "react";

export const EventVenueContext = createContext();

export const eventVenuesReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTVENUES":
      return { eventVenues: action.payload };
    case "ADD_EVENTVENUE":
      return { eventVenues: [action.payload, ...state.eventVenues] };
    case "DELETE_EVENTVENUE":
      return {
        eventVenues: state.eventVenues.filter((g) => g._id !== action.payload._id),
      };
    case "UPDATE_EVENTVENUE":
      return {
        eventVenues: state.eventVenues.map((g) =>
          g._id === action.payload._id ? action.payload : g
        ),
      };
    default:
      return state;
  }
};

export const EventVenueContextProvider = ({ children }) => {
  // used when updating the local view, ensuring it has the same data as the db
  // state - when accessing the eventVenues, setEventVenues - when using a method and passing a payload
  const [state, setEventVenues] = useReducer(eventVenuesReducer, {
    eventVenues: null,
  });
  return (
    <EventVenueContext.Provider value={{ ...state, setEventVenues }}>
      {children}
    </EventVenueContext.Provider>
  );
};
