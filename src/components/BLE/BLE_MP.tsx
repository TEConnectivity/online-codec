import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, HStack, ListItem, Select, Skeleton, Stack, StackDivider, Text, UnorderedList, useBoolean, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";

import ModalCustom from "../ModalCustom";
import DFUlib from "./DFU/DFUlib";
import PlotFFT from "./PlotFFT";


const BW_MODE_BANDWIDTH: Record<number, number> = {
  0x00: 200,
  0x01: 400,
  0x02: 800,
  0x03: 1600,
  0x04: 3200,
  0x05: 4800,
  0x06: 6400,
  0x07: 8000,
  0x08: 9600,
  0x09: 11200,
  0x0A: 12800,
  0x0B: 14400,
  0x0C: 16000,
  0x0D: 17600,
  0x0E: 19200,
  0x0F: 20800,
};


const BW_MODE_RESOLUTION: Record<number, number> = {
  0x00: 0.125,
  0x01: 0.25,
  0x02: 0.5,
  0x03: 1,
  0x04: 2,
  0x05: 3,
  0x06: 4,
  0x07: 5,
  0x08: 6,
  0x09: 7,
  0x0A: 8,
  0x0B: 9,
  0x0C: 10,
  0x0D: 11,
  0x0E: 12,
  0x0F: 13,
}

// BLE Utilities
const BLE_SERVICE_UUID = {
  dataCollection: "b614b300-b14a-40a6-b63f-0166f7868e13",
  lastData: "b614da00-b14a-40a6-b63f-0166f7868e13",
  liveMode: "b614b400-b14a-40a6-b63f-0166f7868e13",
  dataLog: "b614db00-b14a-40a6-b63f-0166f7868e13",

  vibration: "b614fa00-b14a-40a6-b63f-0166f7868e13",


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

  // LastData
  lastData: "b614da01-b14a-40a6-b63f-0166f7868e13",
  vib_dataformat: "b614da02-b14a-40a6-b63f-0166f7868e13",
  raw_data: "b614da03-b14a-40a6-b63f-0166f7868e13",


  // Vibration
  preset_configuration: "b614fa10-b14a-40a6-b63f-0166f7868e13",


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


export type PeakType = {
  freq: number;
  mag: number;
};

export type LastMeasurementType = {
  temp16: number,
  peak_list: PeakType[]
  velocity: number,
  p2p: number
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


  const [selectedBW, setSelectedBW] = useState<number>(0);



  const [lastMeasurement, setLastMeasurement] = useState<LastMeasurementType>({ temp16: 0, velocity: 0, p2p: 0, peak_list: [{ freq: 1, mag: 2 }] })


  const [server, setServer] = useState<BluetoothRemoteGATTServer>();

  const [sensorConnected, sensorConnectedToggle] = useBoolean(false)
  const [dfuMode, setDfuMode] = useBoolean(false)

  const [log, setLog] = useState("")



  // Control modal opening
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalCompletion, setModalCompletion] = useState(0);
  const [modalTitle, setModalTitle] = useState("Wait...")


  const [fftData, setFftData] = useState<number[]>([]); // Store the incoming data


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


  // Trigger Measurement
  const changeBW = async (selected_bw: number) => {
    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.vibration)
    if (service) {


      // Write request to fetch Preset 0 conf
      await writeCharacteristic(service, CHARACTERISTICS.preset_configuration, new Uint8Array([0x00]));

      const preset_config_raw = await readCharacteristicFromService(service, CHARACTERISTICS.preset_configuration, "buffer")

      const uint8Data = new Uint8Array(preset_config_raw!.buffer);

      uint8Data[2] = selected_bw

      await writeCharacteristic(service, CHARACTERISTICS.preset_configuration, uint8Data);

      setSelectedBW(selected_bw);
    }
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




  const handleMeasCountChange = (event: any) => {
    const ev_value: DataView = event.target.value;
    const value = ev_value.getUint16(0)
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

      // Request DF 2 on Axis Z
      const requestPacket = new Uint8Array([0x02, 0x01]);
      await writeCharacteristic(service, CHARACTERISTICS.vib_dataformat, requestPacket);

      const buffer = await readCharacteristicFromService(service, CHARACTERISTICS.vib_dataformat, "buffer")
      if (buffer) {
        const new_state = parseLastData(buffer)
        setLastMeasurement(new_state)
      }
    }
  }

  function parseLastData(buffer: DataView): LastMeasurementType {
    console.log(buffer)

    const new_state: LastMeasurementType = { temp16: buffer.getInt16(2) / 100, velocity: 0, p2p: 0, peak_list: [] }

    const bw_mode: number = buffer.getUint8(6)
    console.log("BW MODE " + bw_mode);

    var fs_mag_rms = buffer.getInt16(7);

    console.log(fs_mag_rms)

    const p2p = buffer.getUint16(9)
    new_state.p2p = p2p;

    const velocity = buffer.getUint16(11)
    new_state.velocity = velocity;

    const peak_count = buffer.getUint8(13)
    console.log("Peak count " + peak_count)

    /** Les peaks demarrent a partir de cet offset */
    const offsetStartPeaks = 14

    // En bit
    const peak_size = 19;

    // Hold the byte in binary represntation "010101". Use string instead of number because BigInt not widely supported.
    let peaks_bitfield = "";

    // Where to stop looking for peak
    const binary_limit = Math.ceil((peak_count * peak_size) / 8)
    for (let i = 0; i < binary_limit; i++) {
      let byte = buffer.getUint8(offsetStartPeaks + i);
      peaks_bitfield += byte.toString(2).padStart(8, '0');
    }

    function dBDecompression(val: number) {
      if (val === 0) return 0;
      return Math.pow(10, ((val * 0.3149606) - 49.0298) / 20);
    }

    // Hold the cursor for bit indexing inside peaks
    let current_bit_index = 0;
    for (let peakIndex = 0; peakIndex < peak_count; peakIndex++) {
      if (current_bit_index + 19 > peaks_bitfield.length) {
        // Not enough bits left for another (PEAK_BIN, PEAK_MAGNITUDE) pair
        break;
      }

      let peak_data: PeakType = { freq: 0, mag: 0 }

      // Bin index is 11 bit wide
      const bin_index = parseInt(peaks_bitfield.substring(current_bit_index, current_bit_index + 11), 2)

      peak_data.freq = bin_index * BW_MODE_RESOLUTION[bw_mode]
      current_bit_index += 11;

      // Magnitude is just after, 8 bit wide
      const magnitude_compressed = parseInt(peaks_bitfield.substring(current_bit_index, current_bit_index + 8), 2);
      peak_data.mag = dBDecompression(magnitude_compressed)
      current_bit_index += 8;

      new_state.peak_list.push(peak_data);
    }

    console.log("new state ", new_state)




    return new_state;
  }





  const readRawData = async () => {

    setModalTitle("Datalog export")
    onOpen()


    const service = await server?.getPrimaryService(BLE_SERVICE_UUID.lastData);
    if (!service) return;

    const characteristic = await service?.getCharacteristic(CHARACTERISTICS.raw_data);
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
          console.log(length)

          if (receivedIndex !== expectedIndex) {
            console.warn(`Unexpected index ${receivedIndex} (expected ${expectedIndex}), ignoring...`);
            return;
          }

          let receivedValues: number[] = [];
          for (let i = 4; i < 4 + length * 2; i += 2) {
            receivedValues.push(ev_value.getInt16(i, false));
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
      requestPacket[3] = 0x28;            // 40 values requested


      const MAX_RETRIES = 10; // Set a limit on the number of retries if needed

      const writeAndWaitForResponse = async (service: BluetoothRemoteGATTService, requestPacket: Uint8Array, index: number) => {
        let retries = 0;

        while (retries < MAX_RETRIES) {
          try {
            // Write the data to the characteristic
            await writeCharacteristic(service, CHARACTERISTICS.raw_data, requestPacket);

            // Wait for the response or timeout after 5 seconds
            const chunk = await Promise.race([
              waitForNotification(index), // The actual function that waits for the response
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for chunk')), 2000)), // Timeout after seconds
            ]);

            // If we reach here, it means chunk was resolved before the timeout
            console.log('Received chunk:', chunk);
            return chunk;
          } catch (error: any) {
            console.error('Error or Timeout:', error);

            if (error.message === 'Timeout waiting for chunk') {
              retries++;
              console.log(`Retrying... (${retries}/${MAX_RETRIES})`);
              if (retries >= MAX_RETRIES) {
                throw new Error('Max retries reached, no response from chunk.');
              }
            } else {
              // Handle other errors, if necessary
              throw error;
            }
          }
        }
      };
      const chunk = await writeAndWaitForResponse(service, requestPacket, index);
      fullDataBuffer.push(...chunk!);

      setModalCompletion(Math.round(index * 100 / 4096));

      // In case datalog is not full
      if (chunk!.length === 0) {
        setModalCompletion(100);
        continue
      }
    }

    // Stop timing
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds

    console.log("Finished fetching all data:", fullDataBuffer);
    console.log(`Total time taken: ${elapsedTime.toFixed(2)} seconds`);

    setFftData(fullDataBuffer);

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

            <PlotFFT rawData={fftData} bw_mode={selectedBW}></PlotFFT>
            <Box>
              Peak list :
              <UnorderedList>
                {lastMeasurement.peak_list.map((peak, cid) => (
                  <ListItem>Freq: {peak.freq} Hz, Mag: {peak.mag.toFixed(4)}</ListItem>
                ))}

              </UnorderedList>

              <Text>Velocity  : {lastMeasurement.velocity}</Text>
              <Text>P2P  : {lastMeasurement.p2p}</Text>
              <Text>BW Mode : {selectedBW}</Text>
            </Box>

            <HStack>

              <Button onClick={triggerMeasurement}>Trigger Measurement</Button>
              <Button onClick={readLastData}>Read Last Data</Button>

              <Text> Temperature: {lastMeasurement.temp16} °C </Text>
              <Select
                placeholder="Select BW Mode"
                value={selectedBW}
                onChange={(e) => changeBW(Number(e.target.value))}
              >
                {Object.entries(BW_MODE_RESOLUTION).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key} : {BW_MODE_BANDWIDTH[Number(key)]} Hz
                  </option>
                ))}
              </Select>
            </HStack>


            <HStack>
              <Button onClick={readRawData}>Read all raw data</Button>
            </HStack>


            <HStack>
              <Button onClick={enableMeasCounterNotifications}>Notify Measurement Counter</Button>
              <Text>Measurement Counter: {measCounter}</Text>
            </HStack>

            <HStack>
              <Button onClick={readMeasInterv}>Read</Button>
              <Text>Measurement Interval: {measInterval.h}:{measInterval.m}:{measInterval.s}</Text>
            </HStack>

            <HStack>
              <Button onClick={switchDFU}><Text>Switch into DFU mode. Sensor is going to <b>reboot</b>.</Text></Button>
            </HStack>
          </VStack>

          <ModalCustom title={modalTitle} isOpen={isOpen} onClose={onClose} completion={modalCompletion}></ModalCustom>

        </> :

        // Sensor in DFU Mode
        <DFUlib></DFUlib>

      }

    </>


  );
}
