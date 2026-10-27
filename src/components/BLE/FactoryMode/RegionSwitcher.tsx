import { Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, HStack, Input, Select, Skeleton, Stack, StackDivider, Text, useBoolean, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { dataViewToHex, hexToBytes, readCharacteristicFromService, writeCharacteristic } from "../Utils";



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
  dev_eui: "b614fb01-b14a-40a6-b63f-0166f7868e13",
  app_eui: "b614fb02-b14a-40a6-b63f-0166f7868e13",
  app_key: "b614fb03-b14a-40a6-b63f-0166f7868e13",

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

  const [devEui, setDevEui] = useState("")
  const [appEui, setAppEui] = useState("")
  const [appKey, setAppKey] = useState("")

  const toast = useToast()


  const [server, setServer] = useState<BluetoothRemoteGATTServer>();
  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)
  const [log, setLog] = useState("")

  // DEV ONLY: lets you preview this screen without a real BLE device / factory mode.
  // Remove `isMock` and the "Preview UI" button below once the feature is validated.
  const [isMock, setIsMock] = useBoolean(false)

  const mockConnect = () => {
    setDeviceInfo({
      firmwareVersion: "4.2.1",
      hardwareRevision: "A",
      manufacturer: "TE Connectivity",
      modelNumber: "SI-TAG-001",
      serialNumber: "MOCK-0000",
    });
    setSelectedRegion(REGION_CODES["EU868"]);
    setDevEui("0123456789ABCDEF");
    setAppEui("FEDCBA9876543210");
    setAppKey("00112233445566778899AABBCCDDEEFF");
    setIsMock.on();
    sensorConnectedToggle.on();
    isDeviceInfoLoadedToggle.on();
    setLog("Mock mode: no real device connected, Read/Write are simulated.");
  };


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
    setSelectedRegion(selected_bw);

    if (isMock) {
      toast({
        title: 'Mock mode',
        description: "Region updated locally (no real device).",
        status: 'info',
        duration: 4000,
        isClosable: true,
      })
      return;
    }

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
    }
  };

  // Strips non-hex characters and uppercases, capped to the expected number of hex digits
  const sanitizeHex = (value: string, maxLength: number) =>
    value.replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, maxLength);

  const readLoraField = async (characUUID: string, setValue: (value: string) => void, label: string) => {
    if (isMock) {
      toast({
        title: 'Mock mode',
        description: `${label} read simulated (no real device).`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      })
      return;
    }

    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.lora)
    if (service) {
      const value = await readCharacteristicFromService(service, characUUID, "buffer");
      if (value)
        setValue(dataViewToHex(value));
      else
        toast({
          title: 'Error',
          description: `Can't read ${label}, please try again`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
    }
  };

  const writeLoraField = async (characUUID: string, hexValue: string, expectedBytes: number, label: string) => {
    if (hexValue.length !== expectedBytes * 2) {
      toast({
        title: 'Invalid value',
        description: `${label} must be exactly ${expectedBytes * 2} hex characters`,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      return;
    }

    if (isMock) {
      toast({
        title: 'Mock mode',
        description: `${label} write simulated (no real device).`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      })
      return;
    }

    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.lora)
    if (service) {
      const result = await writeCharacteristic(service, characUUID, hexToBytes(hexValue));
      if (result)
        toast({
          title: 'Successful write.',
          description: `${label} updated !`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      else
        toast({
          title: 'Error',
          description: `Can't update ${label}, please try again`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
    }
  };


  async function exitFactoryMode() {
    if (isMock) {
      toast({
        title: 'Mock mode',
        description: "Exit simulated, resetting preview.",
        status: 'info',
        duration: 4000,
        isClosable: true,
      })
      setIsMock.off();
      sensorConnectedToggle.off();
      isDeviceInfoLoadedToggle.off();
      return;
    }

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
        {import.meta.env.DEV && (
          <Button mt="5px" colorScheme="purple" variant="outline" onClick={mockConnect}>
            DEV: Preview UI (mock, no device)
          </Button>
        )}
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

        <Card w="100%">
          <CardHeader>
            <Heading size="md">LoRaWAN Keys</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  LoRa DevEUI
                </Heading>
                <HStack pt="2">
                  <Input
                    placeholder="0123456789ABCDEF"
                    value={devEui}
                    onChange={(e) => setDevEui(sanitizeHex(e.target.value, 16))}
                    fontFamily="mono"
                  />
                  <Button onClick={() => readLoraField(CHARACTERISTICS.dev_eui, setDevEui, "DevEUI")}>Read</Button>
                  <Button onClick={() => writeLoraField(CHARACTERISTICS.dev_eui, devEui, 8, "DevEUI")}>Write</Button>
                </HStack>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  LoRa AppEUI
                </Heading>
                <HStack pt="2">
                  <Input
                    placeholder="0123456789ABCDEF"
                    value={appEui}
                    onChange={(e) => setAppEui(sanitizeHex(e.target.value, 16))}
                    fontFamily="mono"
                  />
                  <Button onClick={() => readLoraField(CHARACTERISTICS.app_eui, setAppEui, "AppEUI")}>Read</Button>
                  <Button onClick={() => writeLoraField(CHARACTERISTICS.app_eui, appEui, 8, "AppEUI")}>Write</Button>
                </HStack>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  LoRa AppKey
                </Heading>
                <HStack pt="2">
                  <Input
                    placeholder="0123456789ABCDEF0123456789ABCDEF"
                    value={appKey}
                    onChange={(e) => setAppKey(sanitizeHex(e.target.value, 32))}
                    fontFamily="mono"
                  />
                  <Button onClick={() => readLoraField(CHARACTERISTICS.app_key, setAppKey, "AppKey")}>Read</Button>
                  <Button onClick={() => writeLoraField(CHARACTERISTICS.app_key, appKey, 16, "AppKey")}>Write</Button>
                </HStack>
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
