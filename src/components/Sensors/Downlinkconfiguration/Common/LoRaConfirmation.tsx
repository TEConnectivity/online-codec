import { InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";
import { CharacType, LorapercentageType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: LorapercentageType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<LorapercentageType>({
    percentage: 100,
    type: CharacType.LORA_PERCENTAGE
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
