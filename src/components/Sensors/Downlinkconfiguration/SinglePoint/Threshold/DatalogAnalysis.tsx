import { InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";
import { CharacType, DatalogAnalysisType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: DatalogAnalysisType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState({
    length: 1,
  });


  function handleLengthChange(length: string) {

    setInputValues(prevState => {
      const newState: DatalogAnalysisType = { ...prevState, type: CharacType.DATALOG_ANALYSIS, length: clamp(0, 65535, parseInt(length)) };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack direction={['column', 'row']} >

      <Text>Datalog analysis request (on primary + secondary sensor): </Text>

      <InputGroup  >
        <InputLeftAddon>
          Number of value to read
        </InputLeftAddon>
        <NumberInput defaultValue={0} precision={0} min={1} max={65535} value={inputValues.length} onChange={handleLengthChange}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>


    </VStack>
  );
};
