import { createContext, useReducer } from "react";

export const RoomContext = createContext();

export const roomsReducer = (state, action) => {
  console.log(action.payload);
  switch (action.type) {
    case "SET_ROOMS":
      return { rooms: action.payload };
    case "ADD_ROOM":
      return { rooms: [action.payload, ...state.rooms] };
    case "DELETE_ROOM":
      return {
        rooms: state.rooms.filter((g) => g._id !== action.payload._id),
      };
    case "UPDATE_ROOM":
      return {
        rooms: state.rooms.map((g) =>
          g._id === action.payload._id ? action.payload : g
        ),
      };
    default:
      return state;
  }
};

export const RoomContextProvider = ({ children }) => {
  // used when updating the local view, ensuring it has the same data as the db
  // state - when accessing the rooms, dispatch - when using a method and passing a payload
  const [state, dispatch] = useReducer(roomsReducer, {
    rooms: null,
  });
  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
