import { Flex, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import MultiPoint from "./Sensors/MultiPoint";
import SinglePoint from "./Sensors/SinglePoint";


export default function App() {

  const [sensorFamily, setSensorFamily] = useState("SP");

  var sensorChosen = null
  switch (sensorFamily) {
    case "SP":
      sensorChosen = <SinglePoint />;
      break;
    case "MP":
      sensorChosen = <MultiPoint />;
      break;
    default:
      sensorChosen = null;
  }

  return (
    <Flex flexDirection="column">
      <Text mt="10px">Select Sensor Family</Text>
      <Select onChange={(ev) => setSensorFamily(ev.target.value)} placeholder='Singlepoint, Multipoint...'>
        <option value='SP'>59XX / 69XX / 79XX - SinglePoint family</option>
        <option value='MP'>Multipoint - Coming Soon !</option>
      </Select>

      {sensorChosen}

    </Flex>

  );
};
