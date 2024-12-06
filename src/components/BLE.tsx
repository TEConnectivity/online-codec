import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, HStack, Skeleton, Stack, StackDivider, Text, useBoolean, VStack } from "@chakra-ui/react";
import { useState } from "react";

// BLE Utilities
const BLE_SERVICE_UUID = {
  dataCollection: "b614b300-b14a-40a6-b63f-0166f7868e13",
  lastData: "b614da00-b14a-40a6-b63f-0166f7868e13"

}

const CHARACTERISTICS = {
  firmwareVersion: "firmware_revision_string",
  hardwareRevision: "hardware_revision_string",
  manufacturer: "manufacturer_name_string",
  modelNumber: "model_number_string",
  serialNumber: "serial_number_string",
  measurementTrigger: "b614b303-b14a-40a6-b63f-0166f7868e13",
  measurementInterval: "b614b302-b14a-40a6-b63f-0166f7868e13",
  measurementCounter: "b614b301-b14a-40a6-b63f-0166f7868e13",
  lastData: "b614da01-b14a-40a6-b63f-0166f7868e13",

};

type BLEDataType = "string" | "int" | "float" | "buffer" | "null";


const decodeDataView = (dataView: DataView, encoding: string = "ascii") => new TextDecoder(encoding).decode(dataView.buffer);

export default function App() {

  const [isDeviceInfoLoaded, isDeviceInfoLoadedToggle] = useBoolean(false)
  const [deviceInfo, setDeviceInfo] = useState({
    firmwareVersion: "",
    hardwareRevision: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: ""
  });

  const [measCounter, setMeasCounter] = useState(0);
  const [measInterval, setMeasInterval] = useState({ h: 0, m: 0, s: 0 });


  const [lastMeasurement, setLastMeasurement] = useState({ temp16: 0, sensor32: 0, unit: "", measurand: "" })

  const [server, setServer] = useState<BluetoothRemoteGATTServer>();

  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)
  const [log, setLog] = useState("")



  const initBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ manufacturerData: [{ companyIdentifier: 0x08de }] }],
        optionalServices: ["device_information", ...Object.values(BLE_SERVICE_UUID)],
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
      const serialNumber = await readCharacteristicFromService(service, CHARACTERISTICS.serialNumber, "string");
      const manufacturer = await readCharacteristicFromService(service, CHARACTERISTICS.manufacturer, "string");
      const modelNumber = await readCharacteristicFromService(service, CHARACTERISTICS.modelNumber, "string");

      setDeviceInfo({
        firmwareVersion: firmwareVersion || "N/A",
        hardwareRevision: hardwareRevision || "N/A",
        serialNumber: serialNumber || "N/A",
        manufacturer: manufacturer || "N/A",
        modelNumber: modelNumber || "N/A",
      });
      setLog("Connected!");
      isDeviceInfoLoadedToggle.on()

    } catch (error) {
      console.error("Error initializing BLE:", error);
    }
  };

  const readCharacteristicFromService = async <T extends BLEDataType>(
    service: BluetoothRemoteGATTService,
    characUUID: string,
    dataType: T
  ): Promise<T extends "string" ? string : T extends "int" | "float" ? number : DataView | null> => {
    try {
      const characteristic = await service.getCharacteristic(characUUID);
      const value = await characteristic.readValue();

      if (!value) return null!;

      switch (dataType) {
        case "string":
          return decodeDataView(value) as any; // Assuming ASCII string
        case "int":
          return value.getUint32(0, true) as any; // Example: 32-bit unsigned integer (little endian)
        case "float":
          return value.getFloat32(0, true) as any; // Example: 32-bit float
        case "buffer":
          return value as any; // Return raw DataView
        default:
          throw new Error("Unsupported data type");
      }
    } catch (error) {
      console.error(`Error reading characteristic ${characUUID}:`, error);
      return null!;
    }
  };

  // General Function to Write Characteristics
  const writeCharacteristic = async (serviceUUID: string, characUUID: string, data: Uint8Array) => {
    try {
      const service = await server?.getPrimaryService(serviceUUID);
      const characteristic = await service?.getCharacteristic(characUUID);
      await characteristic?.writeValue(data);
      console.log(`Wrote data to ${characUUID}`);
    } catch (error) {
      console.error(`Error writing ${characUUID}:`, error);
    }
  };


  // Trigger Measurement
  const triggerMeasurement = async () => {
    await writeCharacteristic(BLE_SERVICE_UUID.dataCollection, CHARACTERISTICS.measurementTrigger, Uint8Array.of(0x01));
  };

  // Notification for Measurement Counter
  const enableMeasurementNotifications = async () => {
    try {
      const service = await server?.getPrimaryService(BLE_SERVICE_UUID.dataCollection);
      const characteristic = await service?.getCharacteristic(CHARACTERISTICS.measurementCounter);

      await characteristic?.startNotifications();
      characteristic?.addEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);
      console.log("Notifications enabled for measurement counter");
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  };

  const handleCharacteristicValueChanged = (event: any) => {
    const value = event.target.value.getUint16(0);
    setMeasCounter(value);
    console.log("Received Notification (meas counter):", value);
  };

  const readMeasInterv = async () => {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.dataCollection)
    if (service) {
      const buffer = await readCharacteristicFromService(service, CHARACTERISTICS.measurementInterval, "buffer")
      if (buffer) {
        const totalSeconds = buffer.getUint8(0) * 3600 + buffer.getUint8(1) * 60 + buffer.getUint8(2);
        const new_state = { h: Math.floor(totalSeconds / 3600), m: Math.floor((totalSeconds % 3600) / 60), s: totalSeconds % 60 }
        setMeasInterval(new_state)

      }
    }
  }

  async function readLastData() {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.lastData)
    if (service) {
      const buffer = await readCharacteristicFromService(service, CHARACTERISTICS.lastData, "buffer")
      if (buffer) {


        const new_state = { temp16: buffer.getInt16(0) / 100, sensor32: 0, unit: "", measurand: "" }

        const model = deviceInfo.modelNumber[0]
        switch (model) {
          case ("7"): // Temperature
            new_state.sensor32 = buffer.getInt32(2) / 100
            new_state.measurand = "Temperature"
            new_state.unit = "°C"
            break;
          case ("6"): // Pressure
            new_state.sensor32 = buffer.getFloat32(2)
            new_state.measurand = "Pressure"
            new_state.unit = "Bar"
            break;
          case ("5"): // Humidity
            new_state.sensor32 = buffer.getInt32(2) / 100
            new_state.measurand = "Humidity"
            new_state.unit = "%"
            break;
        }

        setLastMeasurement(new_state)
      }
    }
  }

  return (
    <>
      <Flex flexDirection="column">
        <Text mt="10px">This BLE tool is in beta-state and <Text as="b">should not be used</Text> in production. Support Singlepoint firmware, tested on 3.5.0.</Text>
        <Button onClick={initBLE}>Scan nearby devices</Button>
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

        <HStack>

          <Button onClick={triggerMeasurement}>Trigger Measurement</Button>
          <Button onClick={readLastData}>Read Measurement</Button>
          <Text> Temperature: {lastMeasurement.temp16} °C , {lastMeasurement.measurand}: {lastMeasurement.sensor32} {lastMeasurement.unit} </Text>
        </HStack>

        <Button onClick={enableMeasurementNotifications}>Notify Measurement Counter</Button>
        <Text>Measurement Counter: {measCounter}</Text>

        <HStack>
          <Button onClick={readMeasInterv}>Read</Button>
          <Text>Measurement Interval: {measInterval.h}:{measInterval.m}:{measInterval.s}</Text>
        </HStack>

      </VStack></>
  );
}
