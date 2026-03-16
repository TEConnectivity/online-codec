import { InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";
import { V3_5 } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: V3_5.LorapercentageType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V3_5.LorapercentageType>({
    percentage: 100,
    type: V3_5.CharacTypeCommon_3_5_0.LORA_PERCENTAGE
  });



  function handlPercentageChange(percentage: string) {

    setInputValues(prevState => {
      const newState = { ...prevState, percentage: clamp(0, 100, parseInt(percentage)) };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack justifyContent="center" width={"100%"} direction={['column', 'row']} >

      <Text>Set the percentage of confirmed LoRa messages : </Text>



      <InputGroup justifyContent={"center"} >
        <InputLeftAddon>
          Number of value to read
        </InputLeftAddon>
        <NumberInput defaultValue={0} precision={0} min={0} max={100} value={inputValues.percentage} onChange={handlPercentageChange}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>


      <Text>Confirmed messages allow the sensor to know that it is still connected to the gateway. From 20 missed ACK, the sensor will re-trigger its join process. A missing ACK does not trigger a re-emission. </Text>


    </VStack>
  );
};
