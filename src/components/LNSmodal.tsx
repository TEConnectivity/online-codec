import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useBoolean, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface myProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function App(props: myProps) {


    const [LNS, setLNS] = useState("");

    const [isTestLoading, setTestLoading] = useBoolean(false)
    const [testOK, setTestOK] = useBoolean(false);

    const toast = useToast();

    const [APIKey, setAPIKey] = useState("");



    // TO BE REMOVED
    // NNSXS.HIOVM7D7RL4DA3HXKSDIMLX3X3KZ7HY6HSIV3JI.OXIT2DSVSZIIOJYV6K3Y3CELNAKGCQFYQOU5WXDSTXXVTZ3FGV7A
    const TTN_API_URL = "https://te-connectivity.eu1.cloud.thethings.industries/api/v3";


    async function testLNS() {
        setTestLoading.on()

        try {
            const response = await fetch(`${TTN_API_URL}/applications`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${APIKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            toast({
                title: "Success!",
                description: "API is working. Check console for details.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log("API Response:", data);

            setTestOK.on()

        } catch (error) {
            toast({
                title: "API Error",
                description: error instanceof Error ? error.message : "Unknown error",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setTestLoading.off()

        }

    }

    function saveLNSSettings() {
        props.onClose()
    }


    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Configure your LNS</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Pick your LNS</FormLabel>
                        <Select onChange={(ev) => setLNS(ev.target.value)} placeholder='Select option'>
                            <option value='ttn'>TTN/TTI</option>
                            <option disabled value='chirpstack'>Chirpstack - coming next</option>
                            <option disabled value='cctility'>Actility - coming next</option>
                            <option disabled value='loriot'>Loriot - coming next</option>
                        </Select>
                    </FormControl>

                    {LNS === "ttn" &&
                        <>
                            <FormControl mt={4}>
                                <FormLabel>Domain</FormLabel>
                                <Input placeholder='Your domain' value={"https://eu1.cloud.thethings.network"} />
                                <FormHelperText>Your TTN account cluster address.</FormHelperText>

                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>API Key</FormLabel>
                                <Input placeholder='aaaaa.bbbbb.cccc' value={APIKey} onChange={(ev) => setAPIKey(ev.target.value)} />
                                <FormHelperText>Enter your USER API key above to retrieve all your devices and interact directly with TTN <Link color="teal" href="https://www.thethingsindustries.com/docs/api/concepts/auth/#creating-user-api-keys">(guide)</Link>.</FormHelperText>

                            </FormControl>

                        </>
                    }
                </ModalBody>

                {LNS !== "" &&

                    <ModalFooter>
                        <Button isLoading={isTestLoading} onClick={testLNS} colorScheme='teal' mr={3}>
                            Test
                        </Button>
                        <Button isDisabled={!testOK} onClick={saveLNSSettings} colorScheme='blue' mr={3}>
                            Save
                        </Button>
                        <Button onClick={props.onClose}>Cancel</Button>
                    </ModalFooter>
                }
            </ModalContent>
        </Modal>

    );
};
