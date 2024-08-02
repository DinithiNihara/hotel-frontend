import { createContext, useReducer } from "react";

export const UserContext = createContext();

export const usersReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { users: action.payload };
    case "ADD_USER":
      return { users: [action.payload, ...state.users] };
    case "DELETE_USER":
      return {
        users: state.users.filter((g) => g._id !== action.payload._id),
      };
    case "UPDATE_USER":
      return {
        users: state.users.map((g) =>
          g._id === action.payload._id ? action.payload : g
        ),
      };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  // used when updating the local view, ensuring it has the same data as the db
  // state - when accessing the users, setUsers - when using a method and passing a payload
  const [state, setUsers] = useReducer(usersReducer, {
    users: null,
  });
  return (
    <UserContext.Provider value={{ ...state, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
