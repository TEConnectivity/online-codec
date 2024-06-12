import { Flex, Select, Text } from "@chakra-ui/react";
import { SensorFamily } from "@te-connectivity/iot-codec";
import { useState } from "react";
import CharacSelector from "./Sensors/CharacSelector";



export default function App() {

  const [sensorFamily, setSensorFamily] = useState<SensorFamily>(SensorFamily.Singlepoint);



  return (
    <Flex flexDirection="column">
      <Text mt="10px">Select Sensor Family</Text>
      <Select value={sensorFamily} onChange={(ev) => setSensorFamily(ev.target.value as SensorFamily)} >
        <option value={SensorFamily.Singlepoint}>59XX / 69XX / 79XX - SinglePoint</option>
        <option value={SensorFamily.Multipoint}>8911 / 8931 - Multipoint</option>
      </Select>

      <CharacSelector family={sensorFamily} />

    </Flex>

  );
};
