import { createContext, useContext, useState } from "react";
import React from "react";

const AddModalContext = createContext(undefined);

export const AddModalProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: false, title: "" });

  const onAddOpen = (title) => {
    setState({ isOpen: true, title: title });
  };
  const onClose = () => {
    setState({ isOpen: false });
  };

  return (
    <AddModalContext.Provider value={{ ...state, onAddOpen, onClose }}>
      {children}
    </AddModalContext.Provider>
  );
};

export const useAddModalContext = () => useContext(AddModalContext);
