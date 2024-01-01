import { createContext, useReducer } from "react";

export const GuestContext = createContext();

export const guestsReducer = (state, action) => {
  console.log(action.payload);
  switch (action.type) {
    case "SET_GUESTS":
      return { guests: action.payload };
    case "ADD_GUEST":
      return { guests: [action.payload, ...state.guests] };
    case "DELETE_GUEST":
      return {
        guests: state.guests.filter((g) => g._id !== action.payload._id),
      };
    case "UPDATE_GUEST":
      return {
        guests: state.guests.map((g) =>
          g._id === action.payload._id ? action.payload : g
        ),
      };
    default:
      return state;
  }
};

export const GuestContextProvider = ({ children }) => {
  // used when updating the local view, ensuring it has the same data as the db
  // state - when accessing the guests, dispatch - when using a method and passing a payload
  const [state, dispatch] = useReducer(guestsReducer, {
    guests: null,
  });
  return (
    <GuestContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GuestContext.Provider>
  );
};
