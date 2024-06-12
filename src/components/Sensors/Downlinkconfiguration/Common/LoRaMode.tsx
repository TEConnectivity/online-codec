import { Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { CharacType, LoramodeType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: LoramodeType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<LoramodeType>({
    mode: 0,
    type: CharacType.LORA_MODE
  });


  function handleModeChange(mode: string) {

    setInputValues(prevState => {
      const newState = { ...prevState, mode: clamp(0, 65535, parseInt(mode)) };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack direction={['column', 'row']} >

      <Text>Set the LoRaWAN Communication mode : </Text>

      <RadioGroup onChange={handleModeChange} value={inputValues.mode.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value='0'>On measurement (nominal mode)</Radio>
          <Radio value='1'>Silent mode, no LoRa communication except if threshold is configured</Radio>
        </Stack>
      </RadioGroup>

    </VStack>
  );
};
