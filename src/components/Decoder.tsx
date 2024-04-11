import { Input, InputGroup, InputLeftAddon, StackDivider, Switch, Text, VStack, useBoolean } from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function App() {

  const [isBase64, setIsBase64] = useBoolean(false)


  var temp_decoded_exemple = {
    "bat": 98,
    "cnt": 13149,
    "data": "1.0051547288894653 Bar",
    "devstat": [],
    "devtype": {
      "Output": "Float",
      "Platform": "Platform_21",
      "Sensor": "Pressure",
      "Unit": "Bar",
      "Wireless": "BLE/LoRaWAN"
    },
    "temp": "28.62°C"
  }

  return (
    <VStack align='flex-start'>

      <Text m="10px">Enter your uplink frame </Text>

      <InputGroup>

        <InputLeftAddon p="0px">
          <Switch p="10px" onChange={setIsBase64.toggle}>Base64</Switch>
        </InputLeftAddon>

        <Input placeholder={isBase64 ? "V2l0Y2hlcjMgYmVzdCBnYW1lIGV2ZXI=" : "AABBCCDDEEFF"} />
      </InputGroup>

      <StackDivider />



      <SyntaxHighlighter language="javascript" >
        {JSON.stringify(temp_decoded_exemple, null, " ")}
      </SyntaxHighlighter>


    </VStack>
  );
};
