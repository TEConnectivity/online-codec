import { Box, Button, HStack, InputGroup, Progress, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";
import crc32 from "crc-32";
import { useState } from "react";
import SecureDfu from "web-bluetooth-dfu";
const SecureDfuPackage = require("./firmwarePackage");

type FirmwarePackageType = InstanceType<typeof SecureDfuPackage>;



interface ProgressType {
  currentBytes: number,
  totalBytes: number;
  object: string
}

export default function App() {



  const [firmwarePackage, setFirmwarePackage] = useState<FirmwarePackageType>();
  const [status, setStatus] = useState("");


  const [progress, setProgress] = useState<ProgressType>()



  function setTransfer(state: any) {
    if (!state) {
      return;
    }
    setProgress(state)

  }

  const initBLE = async () => {
    try {

      const dfu = new SecureDfu(crc32.buf);
      dfu.addEventListener("log", event => {
        console.log(event.message);
      });
      dfu.addEventListener("progress", event => {
        setTransfer(event);
      });
      dfu.requestDevice(true, [{ name: "DfuTarg" }])
        .then(device => {
          return update(dfu, device);
        })
        .catch(error => {
          setStatus(error);
        });
    }
    catch (error) {
      console.error("Error initializing BLE:", error);
    }


  };

  // Update a device with all firmware from a package
  function update(dfu: SecureDfu, device: BluetoothDevice) {

    if (!firmwarePackage) return;

    Promise.resolve()
      .then(() => firmwarePackage.getBaseImage())
      .then(image => {
        if (image) {
          setTransfer(`Updating ${image.type}: ${image.imageFile}...`)
          setStatus(`Updating ${image.type}: ${image.imageFile}...`);
          return dfu.update(device, image.initData, image.imageData);
        }
      })
      .then(() => firmwarePackage.getAppImage())
      .then(image => {
        if (image) {
          setTransfer(`Updating ${image.type}: ${image.imageFile}...`);
          setStatus(`Updating ${image.type}: ${image.imageFile}...`);
          return dfu.update(device, image.initData, image.imageData);
        }
      })
      .then(() => {
        setStatus("Update complete!");
        setTransfer("");
      })
      .catch(error => {
        console.log(error);
        setStatus(error);
      });
  }



  // Load a firmware package
  function setPackage(file: File) {

    var myPackage = new SecureDfuPackage(file);

    myPackage.load()
      .then(() => {
        setStatus(`Firmware package: ${file.name}`);
      })
      .catch((error: any) => {
        setStatus(error);
      });

    setFirmwarePackage(myPackage);

  }



  return (
    <>

      <Stack pt="10px" w="100%" divider={<StackDivider borderColor="gray.200" />}>

        <VStack pt="10px" w="100%" divider={<StackDivider borderColor="gray.200" />}>
          <Box>
            <Text> Select your firmware and press GO !</Text>
            <InputGroup>
              <input type={'file'} onChange={(event) => setPackage(event.target.files![0])} accept=".zip" />
            </InputGroup></Box>

          <Box>
            <Button onClick={initBLE}>GO</Button>
          </Box>

          <HStack>
            <Text>{status}</Text>
          </HStack>
          {progress &&
            < Stack >
              <Text>Progress : {progress.currentBytes}/{progress.totalBytes} bytes : {progress.object}</Text>
              <Progress hasStripe value={(progress.currentBytes / progress.totalBytes) * 100} />
            </Stack>
          }

        </VStack>




      </Stack >



    </>


  );
}
