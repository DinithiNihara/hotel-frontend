import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import AddModalBodyGuest from "./AddModalBodyGuest";
import { useAddModalContext } from "../context/AddModalContext";

const AddModal = () => {
  const { isOpen, onClose, title } = useAddModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-2 mx-32 px-4 py-4 rounded-lg">
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text className="text-xl"> Add {title}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {title === "Guest" && <AddModalBodyGuest />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddModal;
