import { Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { V5_2 } from "@te-connectivity/iot-codec";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: V5_2.LoramodeType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V5_2.LoramodeType>({
    mode: "on_measurement",
    type: V5_2.CharacTypeSP_5_2.LORA_MODE
  });


  function handleModeChange(mode: "on_measurement" | "silent" | "merged") {

    setInputValues(prevState => {
      const newState = { ...prevState, mode: mode };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack direction={['column', 'row']} >

      <Text>Set the LoRaWAN Communication mode : </Text>

      <RadioGroup onChange={handleModeChange} value={inputValues.mode.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value='on_measurement'>On measurement (nominal mode)</Radio>
          <Radio value='silent'>Silent mode, no LoRa communication except if threshold is configured</Radio>
          <Radio value='merged'>Merged measurement mode, <Text color={"red"}>Only works if Protocol version 2 is enabled</Text></Radio>
        </Stack>
      </RadioGroup>

    </VStack>
  );
};
