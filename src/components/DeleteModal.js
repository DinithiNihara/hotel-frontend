import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useDeleteModalContext } from "../context/DeleteModalContext";

const DeleteModal = () => {
  const { isOpen, onClose, title, handleDelete } = useDeleteModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-8 mx-72 px-4 py-4 rounded-lg">
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text className="text-xl">{title}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this item?</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleDelete}>
            Yes
          </Button>
          <Button colorScheme="gray" onClick={onClose} ml={3}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
