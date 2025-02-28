import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress } from "@chakra-ui/react";

/* eslint-disable react-hooks/exhaustive-deps */

interface myProps {
    isOpen: boolean;
    onClose: () => void;
    text?: string,
    title: string,
    forbidBGClick: boolean
    completion: number
}

export default function App(props: myProps) {


    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} closeOnEsc={!props.forbidBGClick} closeOnOverlayClick={!props.forbidBGClick}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalBody>
                    {props.text ? props.text : "Please wait for completion..."}
                    <Progress value={props.completion} />
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={props.completion !== 100} colorScheme='blue' mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};
