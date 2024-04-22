import { Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: { type: number }) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState({
    type: 0,
  });


  function handleTypeChange(type: string) {

    setInputValues(prevState => {
      const newState = { ...prevState, type: clamp(0, 65535, parseInt(type)) };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack direction={['column', 'row']} >

      <Text>Set the LoRaWAN Communication mode : </Text>

      <RadioGroup onChange={handleTypeChange} value={inputValues.type.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value='0'>On measurement (nominal mode)</Radio>
          <Radio value='1'>Silent mode, no LoRa communication except if threshold is configured</Radio>
        </Stack>
      </RadioGroup>

    </VStack>
  );
};
