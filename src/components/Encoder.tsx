import { Flex, Select, Text } from "@chakra-ui/react";
import { SensorFamily } from "@te-connectivity/iot-codec";
import { useState } from "react";

import CharacSelector from "./Sensors/CharacSelector";

import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';



export default function App() {

  const [sensorFamily, setSensorFamily] = useState<SensorFamily>(SensorFamily.Multipoint);


  return (
    <Flex flexDirection="column">
      <Text mt="10px">Select Sensor Family (please check  <ChakraLink color='teal.500' as={ReactRouterLink} to='/products'>
        software version compatibility
      </ChakraLink> )</Text>
      <Select value={sensorFamily} onChange={(ev) => setSensorFamily(ev.target.value as SensorFamily)} >
        <option value={SensorFamily.Singlepoint}>59XX / 69XX / 79XX - SinglePoint</option>
        <option value={SensorFamily.Multipoint}>8911 / 8931 - Multipoint</option>
      </Select>

      <CharacSelector family={sensorFamily} />

    </Flex>

  );
};
