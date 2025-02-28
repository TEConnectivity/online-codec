import { Box, Button, Card, CardBody, CardHeader, Checkbox, Flex, Heading, HStack, Skeleton, Stack, StackDivider, Text, useBoolean, useDisclosure, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

import ModalCustom from "../ModalCustom";
import DFUlib from "./DFU/DFUlib";
import PlotSensor from "./PlotSensor";


// BLE Utilities
const BLE_SERVICE_UUID = {
  dataCollection: "b614b300-b14a-40a6-b63f-0166f7868e13",
  lastData: "b614da00-b14a-40a6-b63f-0166f7868e13",
  liveMode: "b614b400-b14a-40a6-b63f-0166f7868e13",
  dataLog: "b614db00-b14a-40a6-b63f-0166f7868e13",

  deviceInformation: "device_information",

  secureDFUService: "0000fe59-0000-1000-8000-00805f9b34fb"

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

  // Datalog
  datalogData: "b614db01-b14a-40a6-b63f-0166f7868e13",
  datalogStat: "b614db02-b14a-40a6-b63f-0166f7868e13",

  // Live Mode
  liveModeInterv: "b614b401-b14a-40a6-b63f-0166f7868e13",
  liveModeConfig: "b614b402-b14a-40a6-b63f-0166f7868e13",

  // DFU
  DFUControlPoint: "8ec90001-f315-4f60-9fb8-838830daea50",
  DFUPacket: "8ec90002-f315-4f60-9fb8-838830daea50",
  DFUButtonlessWithoutBonds: "8ec90003-f315-4f60-9fb8-838830daea50",

};

type BLEDataType = "string" | "int" | "float" | "buffer" | "null";

export type LastMeasurementType = {
  temp16: number,
  sensor32: number,
  unit: string,
  measurand: string
}

const decodeDataView = (dataView: DataView, encoding: string = "ascii") => new TextDecoder(encoding).decode(dataView.buffer as ArrayBuffer);
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


  const [lastMeasurement, setLastMeasurement] = useState<LastMeasurementType>({ temp16: 0, sensor32: 0, unit: "", measurand: "" })


  const [server, setServer] = useState<BluetoothRemoteGATTServer>();

  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)
  const [dfuMode, setDfuMode] = useBoolean(false)

  const [log, setLog] = useState("")

  // Checkbox state : notify data
  const [notifyDataCheckbox, setNotifyDataCheckbox] = useBoolean(false)

  // Checkbox state : live mode
  const [liveModeCheckbox, setLiveModeCheckbox] = useBoolean(false)

  // Control modal opening
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalCompletion, setModalCompletion] = useState(0);
  const [modalTitle, setModalTitle] = useState("Wait...")


  const initBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ manufacturerData: [{ companyIdentifier: 0x08de }] }],
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
      setLog("Connected!");
      isDeviceInfoLoadedToggle.on()

    } catch (error) {
      setLog(`Error connecting... Please try again : ${error}`)
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
  const writeCharacteristicString = async (serviceUUID: string, characUUID: string, data: Uint8Array) => {
    try {
      const service = await server?.getPrimaryService(serviceUUID);
      if (service)
        writeCharacteristic(service, characUUID, data)
    } catch (error) {
      console.error(`Error getting service ${serviceUUID}:`, error);
    }
  };

  // General Function to Write Characteristics
  const writeCharacteristic = async (service: BluetoothRemoteGATTService, characUUID: string, data: Uint8Array) => {
    try {
      const characteristic = await service?.getCharacteristic(characUUID);
      await characteristic?.writeValue(data);
      console.log(`Wrote ${data} to ${characUUID}`);
    } catch (error) {
      console.error(`Error writing ${characUUID}:`, error);
    }
  };



  // Trigger Measurement
  const triggerMeasurement = async () => {
    await writeCharacteristicString(BLE_SERVICE_UUID.dataCollection, CHARACTERISTICS.measurementTrigger, Uint8Array.of(0x01));
  };



  // Notification for Measurement Counter
  const enableMeasCounterNotifications = async () => {
    try {
      const service = await server?.getPrimaryService(BLE_SERVICE_UUID.dataCollection);
      const characteristic = await service?.getCharacteristic(CHARACTERISTICS.measurementCounter);

      await characteristic?.startNotifications();
      characteristic?.addEventListener("characteristicvaluechanged", handleMeasCountChange);
      console.log("Notifications enabled for measurement counter");
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  };


  /**
   * 
   * @param service 
   * @param charac 
   * @param handle Handle is a the function taht will be called when the value of the charac change
   */
  const enableNotification = async (service: BluetoothServiceUUID, charac: BluetoothCharacteristicUUID, handle: (this: BluetoothRemoteGATTCharacteristic, ev: Event) => any) => {
    try {
      const _service = await server?.getPrimaryService(service);
      const characteristic = await _service?.getCharacteristic(charac);

      await characteristic?.startNotifications();
      characteristic?.addEventListener("characteristicvaluechanged", handle);
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  };

  const stopNotification = async (service: BluetoothServiceUUID, charac: BluetoothCharacteristicUUID) => {
    try {
      const _service = await server?.getPrimaryService(service);
      const characteristic = await _service?.getCharacteristic(charac);

      await characteristic?.stopNotifications();
    } catch (error) {
      console.error("Error stopping notifications:", error);
    }
  };


  const handleMeasCountChange = (event: any) => {
    const ev_value: DataView = event.target.value;
    const value = ev_value.getFloat32(0)
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
        const new_state = parseLastData(buffer)
        setLastMeasurement(new_state)
      }
    }
  }

  function parseLastData(buffer: DataView): LastMeasurementType {
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

    return new_state;
  }

  async function handleCheckboxLiveMode(event: React.ChangeEvent<HTMLInputElement>) {
    setLiveModeCheckbox.toggle();

    if (event.target.checked)
      await writeCharacteristicString(BLE_SERVICE_UUID.liveMode, CHARACTERISTICS.liveModeConfig, Uint8Array.of(0x01));
    else
      await writeCharacteristicString(BLE_SERVICE_UUID.liveMode, CHARACTERISTICS.liveModeConfig, Uint8Array.of(0x00));

  }


  function handleCheckboxNotifyData(event: React.ChangeEvent<HTMLInputElement>): void {
    setNotifyDataCheckbox.toggle();
    if (event.target.checked)
      enableNotification(BLE_SERVICE_UUID.lastData, CHARACTERISTICS.lastData, handleLastDataChange)
    else {
      stopNotification(BLE_SERVICE_UUID.lastData, CHARACTERISTICS.lastData)
    }
  }


  const [incomingData, setIncomingData] = useState<LastMeasurementType>(); // Store the incoming data

  const handleLastDataChange = (event: any) => {
    const value = parseLastData(event.target.value)
    setIncomingData(value);
  }


  const downloadCSV = (data: number[], filename: string = "file.csv") => {
    const csvContent = data.map(value => value.toString()).join("\n"); // Convert to CSV format
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const readDatalogData = async () => {

    setModalTitle("Datalog export")
    onOpen()


    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.dataLog);
    if (!service) return;

    const characteristic = await service?.getCharacteristic(CHARACTERISTICS.datalogData);
    if (!characteristic) return;

    await characteristic.startNotifications();

    let fullDataBuffer: number[] = [];

    const waitForNotification = (expectedIndex: number): Promise<number[]> => {
      return new Promise((resolve) => {
        const handler = (event: any) => {
          const ev_value: DataView = event.target.value;
          // console.log(ev_value)

          const receivedIndex = ev_value.getUint16(1, false); // Little-endian
          const length = ev_value.getUint8(3);

          if (receivedIndex !== expectedIndex) {
            console.warn(`Unexpected index ${receivedIndex} (expected ${expectedIndex}), ignoring...`);
            return;
          }

          let receivedValues: number[] = [];
          for (let i = 4; i < 4 + length * 4; i += 4) {
            receivedValues.push(ev_value.getFloat32(i, false));
          }

          // console.log(`Received ${length} values from index ${receivedIndex}`);
          characteristic.removeEventListener("characteristicvaluechanged", handler);
          resolve(receivedValues);
        };

        characteristic.addEventListener("characteristicvaluechanged", handler);
      });
    };

    const startTime = performance.now();


    for (let index = 0; index < 4096; index += 40) {
      // console.log(`Requesting data from index ${index}`);

      // Construct the request packet (0x01XXXX28)
      const requestPacket = new Uint8Array(4);
      requestPacket[0] = 0x01;                      // Command
      requestPacket[1] = (index >> 8) & 0xff;   // Lower byte of index
      requestPacket[2] = index & 0xff;    // Upper byte of index
      requestPacket[3] = 0x28;                      // 40 values requested


      await writeCharacteristic(service, CHARACTERISTICS.datalogData, requestPacket);

      // Wait for response and store it
      const chunk = await waitForNotification(index);
      fullDataBuffer.push(...chunk);

      setModalCompletion(Math.round(index * 100 / 4096));

      // In case datalog is not full
      if (chunk.length === 0) {
        setModalCompletion(100);
        continue
      }
    }

    // Stop timing
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds

    console.log("Finished fetching all data:", fullDataBuffer);
    console.log(`Total time taken: ${elapsedTime.toFixed(2)} seconds`);

    downloadCSV(fullDataBuffer, "datalog.csv");


  };


  // DFU

  async function switchDFU() {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.secureDFUService)
    if (service) {

      // First enable notification because it seems mandatory to switch DFU
      const characteristic = await service?.getCharacteristic(CHARACTERISTICS.DFUButtonlessWithoutBonds);
      await characteristic?.startNotifications();

      // Then write 0x01 in the charac
      await writeCharacteristicString(BLE_SERVICE_UUID.secureDFUService, CHARACTERISTICS.DFUButtonlessWithoutBonds, Uint8Array.of(0x01));

      // The sensor should now reboot ! Disconnecting UI 
      sensorConnectedToggle.off()
      setDfuMode.on()


    }
  }

  return (
    <>

      {!dfuMode ?

        // Sensor in normal state
        <>
          <Flex flexDirection="column">
            <Text mt="10px">This BLE tool is in beta-state and <Text as="b">should not be used</Text> in production. Support Singlepoint firmware, tested on 3.5.0.</Text>
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
            <PlotSensor incomingData={incomingData}></PlotSensor>

            <HStack>
              <Checkbox isChecked={liveModeCheckbox} onChange={handleCheckboxLiveMode}>Live Mode</Checkbox>
              <Button onClick={triggerMeasurement}>Trigger Measurement</Button>
              <Button onClick={readLastData}>Read Last Data</Button>
              <Checkbox isChecked={notifyDataCheckbox} onChange={handleCheckboxNotifyData}>Notify Data</Checkbox>
              <Text> Temperature: {lastMeasurement.temp16} °C , {lastMeasurement.measurand}: {lastMeasurement.sensor32} {lastMeasurement.unit} </Text>
            </HStack>



            <HStack>
              <Button onClick={enableMeasCounterNotifications}>Notify Measurement Counter</Button>
              <Text>Measurement Counter: {measCounter}</Text>
            </HStack>

            <HStack>
              <Button onClick={readDatalogData}>Full Datalog Export</Button>
              <Text>Progression: {measCounter}</Text>
            </HStack>

            <HStack>
              <Button onClick={readMeasInterv}>Read</Button>
              <Text>Measurement Interval: {measInterval.h}:{measInterval.m}:{measInterval.s}</Text>
            </HStack>

            <HStack>
              <Button onClick={switchDFU}><Text>Switch into DFU mode. Sensor is going to <b>reboot</b>.</Text></Button>
            </HStack>
          </VStack>

          <ModalCustom title={modalTitle} isOpen={isOpen} onClose={onClose} completion={modalCompletion} forbidBGClick></ModalCustom>

        </> :

        // Sensor in DFU Mode
        <DFUlib></DFUlib>

      }

    </>


  );
}
