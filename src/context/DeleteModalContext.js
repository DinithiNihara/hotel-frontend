import { createContext, useContext, useState } from "react";
import React from "react";

const DeleteModalContext = createContext(undefined);

export const DeleteModalProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    data: {},
    endpoint: "",
    method: "",
    handleDeleteCallback: () => {},
  });

  const onDeleteOpen = (
    title,
    endpoint,
    method,
    data,
    handleDeleteCallback
  ) => {
    setState({
      isOpen: true,
      title,
      endpoint,
      method,
      data,
      handleDeleteCallback,
    });
  };

  const onClose = () => {
    setState({ isOpen: false });
  };

  const handleDelete = async () => {
    try {
      const { endpoint, method, handleDeleteCallback } = state;
      const response = await fetch(endpoint, {
        method: method,
      });
      const json = await response.json();

      if (response.ok) {
        handleDeleteCallback(json); // Call the function to update the state after deletion
        onClose(); // Close the modal
      } else {
        console.error(json.error); // Handle error here
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteModalContext.Provider
      value={{ ...state, onDeleteOpen, onClose, handleDelete }}
    >
      {children}
    </DeleteModalContext.Provider>
  );
};

export const useDeleteModalContext = () => useContext(DeleteModalContext);
