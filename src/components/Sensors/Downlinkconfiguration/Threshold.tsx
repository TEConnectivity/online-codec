import { HStack, Text, InputGroup, InputLeftAddon, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, VStack, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import PopoverCustom from "../../../shared/PopoverCustom";
import ThresholdPopOverSimple from "./ThresholdPopOverSimple";
import ThresholdPopOverComplex from "./ThresholdPopOverComplex";


interface ChildrenProps {
  onInputChange: (data: { hour: string, minute: string, second: string }) => void;
}






export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState({
    id_data: '0',
    minute: '0',
    second: '0',
  });

  // // Callback function, when the user edit the form, the payload is automatically regenerated
  // function handleHour(inputHour: string) {
  //   var newState = {hour:inputHour, minute: inputValues.minute, second:inputValues.second}
  //   setInputValues(newState)
  //   onInputChange(newState)
  // }


  return (
    <VStack width={"100%"} justifyContent={"flex-start"}>
      <Text>Configure <ThresholdPopOverSimple>one threshold</ThresholdPopOverSimple> if you want a simple alarm. Configure <ThresholdPopOverComplex>two threshold</ThresholdPopOverComplex> if you want out-of-range or successive detection.</Text>
      <Select placeholder='Data source...'>
        <option value='00'>Main Sensor data Threshold 1</option>
        <option value='SP'>SinglePoint</option>
        <option disabled value='MP'>Multipoint - Coming Soon !</option>
      </Select>
    </VStack>
  );
};
