import { Flex, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import Legacy89XX from "./Sensors/Legacy89XX";
import SinglePoint from "./Sensors/SinglePoint";


export default function App() {

  const [sensorFamily, setSensorFamily] = useState("");

  var sensorChosen = null
  switch (sensorFamily) {
    case "SP":
      sensorChosen = <SinglePoint />;
      break;
    case "89XX":
      sensorChosen = <Legacy89XX />;
      break;
    default:
      sensorChosen = null;
  }

  return (
    <Flex flexDirection="column">
      <Text mt="10px">Select Sensor Family</Text>
      <Select onChange={(ev) => setSensorFamily(ev.target.value)} placeholder='Singlepoint, Multipoint...'>
        <option value='89XX'>8911 / 8931 Legacy</option>
        <option value='SP'>SinglePoint</option>
        <option disabled value='MP'>Multipoint - Coming Soon !</option>
      </Select>

      {sensorChosen}

    </Flex>

  );
};
