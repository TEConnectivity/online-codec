import { Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { V5_2 } from "@te-connectivity/iot-codec";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: V5_2.ProtocolVersionType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V5_2.ProtocolVersionType>({
    version: 2,
    type: V5_2.CharacTypeGen_5_2.PROTOCOL_VERSION
  });


  function handleProtocolVersionChange(version_inc: string) {

    let parsed: 1 | 2 = version_inc === "1" ? 1 : 2


    setInputValues(prevState => {
      const newState = { ...prevState, version: parsed };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack direction={['column', 'row']} >

      <Text>Set the LoRaWAN Frame Protocol version. V2 enables timestamp as well as others new features.</Text>

      <RadioGroup onChange={handleProtocolVersionChange} value={inputValues.version.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value="1">v1</Radio>
          <Radio value="2">v2</Radio>
        </Stack>
      </RadioGroup>

    </VStack>
  );
};
