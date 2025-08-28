import { Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, Select, Skeleton, Stack, StackDivider, Text, useBoolean, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { readCharacteristicFromService, writeCharacteristic } from "../Utils";



// BLE Utilities
const BLE_SERVICE_UUID = {

  engineering: "b614dd00-b14a-40a6-b63f-0166f7868e13", // To exit factory mode
  lora: "b614fb00-b14a-40a6-b63f-0166f7868e13", // To exit factory mode


  deviceInformation: "device_information",


}

const CHARACTERISTICS = {
  firmwareVersion: "firmware_revision_string",
  hardwareRevision: "hardware_revision_string",
  manufacturer: "manufacturer_name_string",
  modelNumber: "model_number_string",
  serialNumber: "serial_number_string",

  // Factory Activation
  eng_command: "b614dd01-b14a-40a6-b63f-0166f7868e13",

  // Lora
  region: "b614fb04-b14a-40a6-b63f-0166f7868e13",


};

// Mapping region string → numeric ID
export const REGION_CODES: Record<string, number> = {
  "AS923-1": 0,
  "AU915": 1,
  "CN470": 2,
  "CN779": 3,
  "EU433": 4,
  "EU868": 5,
  "KR920": 6,
  "IN865": 7,
  "US915": 8,
  "RU864": 9,
  "AS923-2": 10,
  "AS923-3": 11,
  "AS923-4": 12,
};


export default function App() {

  const [isDeviceInfoLoaded, isDeviceInfoLoadedToggle] = useBoolean(false)
  const [deviceInfo, setDeviceInfo] = useState({
    firmwareVersion: "",
    hardwareRevision: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: ""
  });

  const [selectedRegion, setSelectedRegion] = useState(0)

  const toast = useToast()


  const [server, setServer] = useState<BluetoothRemoteGATTServer>();
  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)
  const [log, setLog] = useState("")


  const initBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          manufacturerData: [{
            companyIdentifier: 0x08de
          }]

        }],
        optionalServices: [...Object.values(BLE_SERVICE_UUID)],
      });
      console.log(device)
      setLog("Device found: " + device.name + ", connection...");

      // Connect to the GATT server
      const gattServer = await device.gatt?.connect()!;
      setLog("Connected to device ! Fetching device information...");
      sensorConnectedToggle.on()

      // Use the `gattServer` directly here, without relying on the React state update.
      setServer(gattServer); // Still set it for later use in other functions

      // Read device information
      const service = await gattServer.getPrimaryService("device_information");
      const firmwareVersion = await readCharacteristicFromService(service, CHARACTERISTICS.firmwareVersion, "string");
      const hardwareRevision = await readCharacteristicFromService(service, CHARACTERISTICS.hardwareRevision, "string");
      const serialNumber = await readCharacteristicFromService(service, CHARACTERISTICS.serialNumber, "string"); // Forbidden to request serial number https://goo.gl/4NeimX
      const manufacturer = await readCharacteristicFromService(service, CHARACTERISTICS.manufacturer, "string");
      const modelNumber = await readCharacteristicFromService(service, CHARACTERISTICS.modelNumber, "string");
      setDeviceInfo({
        firmwareVersion: firmwareVersion || "N/A",
        hardwareRevision: hardwareRevision || "N/A",
        serialNumber: serialNumber || "N/A",
        manufacturer: manufacturer || "N/A",
        modelNumber: modelNumber || "N/A",
      });


      // Fetch current region
      const lora_service = await gattServer.getPrimaryService(BLE_SERVICE_UUID.lora);
      const region = await readCharacteristicFromService(lora_service, CHARACTERISTICS.region, "int8");
      setSelectedRegion(region)


      setLog("Connected!");
      isDeviceInfoLoadedToggle.on()

    } catch (error) {
      setLog(`Error connecting... Please try again : ${error}`)
      console.error("Error initializing BLE:", error);
    }
  };


  const changeRegion = async (selected_bw: number) => {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.lora)
    if (service) {

      const result = await writeCharacteristic(service, CHARACTERISTICS.region, Uint8Array.of(selected_bw));
      if (result)
        toast({
          title: 'Successful write.',
          description: "Region updated !",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })

      else
        toast({
          title: 'Error',
          description: "Can't update region, please try again",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })

      setSelectedRegion(selected_bw);
    }
  };


  async function exitFactoryMode() {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.engineering)
    if (service) {

      // Request DF 2 on Axis Z
      const command = new Uint8Array([0x01]);
      const result = await writeCharacteristic(service, CHARACTERISTICS.eng_command, command);
      if (result) {
        toast({
          title: 'Success',
          description: "Rebooting...",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        // Redirect after a few seconds
        setTimeout(() => {
          window.location.href = "/online-codec/ble-tool/region-change";
        }, 4500);
      }
      else
        toast({
          title: 'Error',
          description: "Can't exit, please try again",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })



    }
  }


  return (


    // Sensor in normal state
    <>
      <Flex flexDirection="column">
        <Text mt="10px">This BLE tool is in beta-state and <Text as="b">should not be used</Text> in production. Support 3.x to 4.x firmware.</Text>
        <Text fontSize={"lg"}>The sensor stay in Factory Mode only a few minute.</Text>
        <Button onClick={initBLE}>Scan nearby devices (take up to 30s)</Button>
        <Text>{log}</Text>

      </Flex>


      <VStack pt="10px" w="100%" display={sensorConnected ? "inline-block" : "none"} divider={<StackDivider borderColor="gray.200" />}>

        <Center><Text fontSize='4xl' color='tomato'>Factory Mode</Text></Center>


        <Card>
          <CardHeader>
            <Heading size="md">Device Information</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Firmware Version
                </Heading>
                <Skeleton isLoaded={isDeviceInfoLoaded}>
                  <Text pt="2" fontSize="sm">
                    {deviceInfo.firmwareVersion}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Hardware Revision
                </Heading>
                <Skeleton isLoaded={isDeviceInfoLoaded}>
                  <Text pt="2" fontSize="sm">
                    {deviceInfo.hardwareRevision}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Model Number
                </Heading>
                <Skeleton isLoaded={isDeviceInfoLoaded}>
                  <Text pt="2" fontSize="sm">
                    {deviceInfo.modelNumber}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Serial Number
                </Heading>
                <Skeleton isLoaded={isDeviceInfoLoaded}>
                  <Text pt="2" fontSize="sm">
                    {deviceInfo.serialNumber}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Manufacturer
                </Heading>
                <Skeleton isLoaded={isDeviceInfoLoaded}>
                  <Text pt="2" fontSize="sm">
                    {deviceInfo.manufacturer}
                  </Text>
                </Skeleton>
              </Box>
            </Stack>
          </CardBody>
        </Card>

        <Skeleton isLoaded={isDeviceInfoLoaded}>
          Region :
          <Select
            placeholder="Select Region"
            value={selectedRegion}
            onChange={(e) => changeRegion(Number(e.target.value))}
          >
            {Object.entries(REGION_CODES).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </Skeleton>

        <Button onClick={exitFactoryMode}>Exit factory mode (reboot)</Button>


      </VStack>

    </>


  );
}
