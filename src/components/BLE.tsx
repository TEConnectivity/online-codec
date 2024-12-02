import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";




export default function App() {

  const [FWVersion, SetFWVersion] = useState("");



  function dataViewToString(dataView: DataView) {
    let decoder = new TextDecoder('ascii');
    return decoder.decode(dataView.buffer);
  }


  function testBLE() {

    navigator.bluetooth.requestDevice({ filters: [{ manufacturerData: [{ companyIdentifier: 0x08DE }] }], optionalServices: ['device_information'] })
      .then(device => {
        console.log(device)
        // Attempts to connect to remote GATT Server.

        return device?.gatt?.connect();
      }).then(server => {
        console.log(server)

        return server?.getPrimaryService('device_information');

      }).then(async service => {

        // Getting Firmware Version Characteristic
        const fw_charac = await service?.getCharacteristic('firmware_revision_string');
        var response = await fw_charac?.readValue();
        SetFWVersion(dataViewToString(response!));

        // Getting Hardware Version Characteristic
        const hw_charac = await service?.getCharacteristic('hardware_revision_string');
        response = await hw_charac?.readValue();


      })
      .catch(error => { console.error(error); });
  }

  return (
    <VStack pt="10px" w="100%" divider={<StackDivider borderColor='gray.200' />}>

      <Flex flexDirection="column">
        <Text mt="10px">This BLE tool is in beta-state and <Text as='b'>should not be used</Text> in production.</Text>
        <Button onClick={testBLE}>Scan nearby devices</Button>
      </Flex>

      <Card>
        <CardHeader>
          <Heading size='md'>Device Information</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Firmware Version
              </Heading>
              <Text pt='2' fontSize='sm'>
                {FWVersion}
              </Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Overview
              </Heading>
              <Text pt='2' fontSize='sm'>
                Check out the overview of your clients.
              </Text>
            </Box>

          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};
