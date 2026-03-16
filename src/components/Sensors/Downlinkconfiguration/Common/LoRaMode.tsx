import { Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { V3_5 } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: V3_5.LoramodeType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V3_5.LoramodeType>({
    mode: "on_measurement",
    type: V3_5.CharacTypeCommon_3_5_0.LORA_MODE
  });


  function handleModeChange(mode: "on_measurement" | "silent") {

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
        </Stack>
      </RadioGroup>

    </VStack>
  );
};
