import { Alert, AlertIcon, Button, Flex, Select, Text, useDisclosure } from "@chakra-ui/react";
import { SensorFamily } from "@te-connectivity/iot-codec";
import { useState } from "react";

import CharacSelector from "./Sensors/CharacSelector";

import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import LNSmodal from "./LNSmodal";



export default function App() {

  const [sensorFamily, setSensorFamily] = useState<SensorFamily>(SensorFamily.Multipoint);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()


  return (
    <Flex flexDirection="column">


      <Alert status='info'>
        <AlertIcon />
        Connect this with your LNS ! <Button onClick={onOpen} size={"sm"} marginX={"10px"} >Go</Button>
      </Alert>
      <LNSmodal isOpen={isOpen} onClose={onClose}></LNSmodal>


      <Text mt="10px">Select Sensor Family (please check  <ChakraLink color='teal.500' as={ReactRouterLink} to='/products'>
        software version compatibility
      </ChakraLink> )</Text>
      <Select value={sensorFamily} onChange={(ev) => setSensorFamily(ev.target.value as SensorFamily)} >
        <option value={SensorFamily.Singlepoint}>59XXN / 69XXN / 79XXN - SinglePoint (3.5.0)</option>
        <option value={SensorFamily.Multipoint}>8911N / 8931N - Multipoint (4.1.x)</option>
      </Select>

      <CharacSelector family={sensorFamily} />

    </Flex>

  );
};
