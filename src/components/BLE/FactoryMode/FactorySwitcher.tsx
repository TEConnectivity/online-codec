import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, HStack, Input, Select, Skeleton, Stack, StackDivider, Text, useBoolean, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { hexStringToUint8Array } from "@te-connectivity/iot-codec";

import Factory, { REGION_CODES } from "./RegionSwitcher";
import { dataViewToHex, readCharacteristicFromService, writeCharacteristic } from "../Utils";


// BLE Utilities
const BLE_SERVICE_UUID = {

  factory: "b614ee00-b14a-40a6-b63f-0166f7868e13",
  lora: "b614f800-b14a-40a6-b63f-0166f7868e13", // To exit factory mode

  deviceInformation: "device_information",


}

const CHARACTERISTICS = {
  firmwareVersion: "firmware_revision_string",
  hardwareRevision: "hardware_revision_string",
  manufacturer: "manufacturer_name_string",
  modelNumber: "model_number_string",
  serialNumber: "serial_number_string",

  // Factory Activation
  factoryActivation: "b614eeff-b14a-40a6-b63f-0166f7868e13",

  // Lora
  region: "b614f803-b14a-40a6-b63f-0166f7868e13",


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

  const [factoryChallenge, setfactoryChallenge] = useState("") // Value read from the service
  const [factoryEncrypted, setfactoryEncrypted] = useState("") // Value once it has been encrypted by TE
  const [isFactory, isFactoryToggle] = useBoolean(false)

  const [selectedRegion, setSelectedRegion] = useState(0)


  const [server, setServer] = useState<BluetoothRemoteGATTServer>();

  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)

  const [log, setLog] = useState("")
  const toast = useToast()


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


      // Read factory challenge
      const factory_service = await gattServer.getPrimaryService(BLE_SERVICE_UUID.factory);
      const factory_challenge = await readCharacteristicFromService(factory_service, CHARACTERISTICS.factoryActivation, "buffer");
      if (factory_challenge)
        setfactoryChallenge(dataViewToHex(factory_challenge))

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



  async function switchFactoryMode() {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.factory)
    if (service) {

      const encrypted = factoryEncrypted.replaceAll(" ", "")
      console.log(encrypted)
      console.log(hexStringToUint8Array(encrypted))
      const result = await writeCharacteristic(service, CHARACTERISTICS.factoryActivation, hexStringToUint8Array(encrypted))
      if (result) {
        toast({
          title: 'Successful.',
          description: "Switched to factory ! Sensor rebooted, please scan again.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })

      }
      else {
        toast({
          title: 'Fail',
          description: "Did not switched to factory... Make sure device is not powered for more than 10 minutes. Please reconnect to the sensor.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      // The sensor should now reboot ! Disconnecting UI 
      sensorConnectedToggle.off()
      isFactoryToggle.on()

    }

  }


  return (
    <>

      {!isFactory ?

        // Sensor in normal state
        <>
          <Flex flexDirection="column">
            <Text mt="10px">This BLE tool must be used with TE Support. Support 3.x to 4.x firmware.</Text>
            <Text as="b">Switching to Factory mode is only possible within the 10mn after boot!</Text>
            <Button onClick={initBLE}>Scan nearby devices (take up to 30s)</Button>
            <Text>{log}</Text>

          </Flex>


          <VStack pt="10px" w="100%" display={sensorConnected ? "inline-block" : "none"} divider={<StackDivider borderColor="gray.200" />}>


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

            {/* LORAWAN CURRENT REGION */}
            <Skeleton isLoaded={isDeviceInfoLoaded}>
              Current Region :
              <Select
                placeholder="Select Region"
                value={selectedRegion}
              >
                {Object.entries(REGION_CODES).map(([name, code]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </Skeleton>


            {/* FACTORY KEYS & CHANGE */}
            <Skeleton isLoaded={isDeviceInfoLoaded}>
              <Text pt="2" fontSize="sm">
                Challenge factory {factoryChallenge}
              </Text>
            </Skeleton>
            <HStack>
              <Input value={factoryEncrypted} onChange={(ev) => setfactoryEncrypted(ev.target.value)}></Input>
              <Button onClick={switchFactoryMode}><Text>Switch into factory mode</Text></Button>
            </HStack>


          </VStack>

        </> :

        // Sensor in now in Factory Mode
        <Factory></Factory>

      }

    </>


  );

}