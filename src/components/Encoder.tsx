import { Flex, Select, Text, Box } from "@chakra-ui/react";
import { DeviceModel, FirmwareVersion, FirmwareSupportMap } from "@te-connectivity/iot-codec";
import { useState } from "react";

import CharacSelector from "./Sensors/CharacSelector";

import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const getSupportedFirmware = (model: DeviceModel): FirmwareVersion[] => {
  return (Object.entries(FirmwareSupportMap) as [
    FirmwareVersion,
    Partial<Record<DeviceModel, unknown>>
  ][])
    .filter(([, models]) => model in models)
    .map(([fw]) => fw);
};

export default function App() {

  const [sensorFamily, setSensorFamily] = useState<DeviceModel>(DeviceModel.VIBRATION);
  const [FWVersion, setFWVersion] = useState<FirmwareVersion>(FirmwareVersion.V4_1);

  const supportedFirmware = getSupportedFirmware(sensorFamily);

  return (
    <Flex flexDirection="column" gap="20px">

      <Text mt="10px">
        Select Sensor Model and Firmware Version (please check{" "}
        <ChakraLink color="teal.500" as={ReactRouterLink} to="/products">
          software version compatibility
        </ChakraLink>
        )
      </Text>

      <Flex gap="20px">

        {/* Sensor Model */}
        <Box>
          <Text mb="5px">Sensor Model</Text>
          <Select
            value={sensorFamily}
            onChange={(ev) => {
              const model = ev.target.value as DeviceModel;
              setSensorFamily(model);

              const fw = getSupportedFirmware(model);
              if (!fw.includes(FWVersion)) {
                setFWVersion(fw[0]); // auto switch to first compatible
              }
            }}
          >
            <option value={DeviceModel.SINGLEPOINT}>59XXN (Humidity) / 69XXN (Pressure)</option>
            <option value={DeviceModel.VIBRATION}>8911N / 8931N Vibration</option>
          </Select>
        </Box>

        {/* Firmware Version */}
        <Box>
          <Text mb="5px">Firmware Version</Text>
          <Select
            value={FWVersion}
            onChange={(ev) => setFWVersion(ev.target.value as FirmwareVersion)}
          >
            {supportedFirmware.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </Select>
        </Box>

      </Flex>

      <CharacSelector family={sensorFamily} fwVersion={FWVersion} />

    </Flex>
  );
}