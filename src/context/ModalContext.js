import { createContext, useContext, useState } from "react";
import React from "react";

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: false, title: "", data: {} });

  const onOpen = (title, data) => {
    setState({ isOpen: true, title: title, data: data });
  };
  const onClose = () => {
    setState({ isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ ...state, onOpen, onClose }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
