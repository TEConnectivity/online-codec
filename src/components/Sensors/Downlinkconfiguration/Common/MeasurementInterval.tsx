import { HStack, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { CharacType, MeasIntervalType } from "@te-connectivity/iot-codec";
import { useState } from "react";

interface ChildrenProps {
  onInputChange: (data: MeasIntervalType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<MeasIntervalType>({
    hour: '0',
    minute: '0',
    second: '0',
    type: CharacType.MEAS_INTERVAL
  });



  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handleHour(inputHour: string) {
    setInputValues(prevState => {
      const newState = { ...prevState, hour: inputHour };
      onInputChange(newState);
      return newState;
    });

  }
  function handleMinute(inputMinute: string) {
    setInputValues(prevState => {
      const newState = { ...prevState, minute: inputMinute };
      onInputChange(newState);
      return newState;
    });
  }
  function handleSecond(inputSecond: string) {
    setInputValues(prevState => {
      const newState = { ...prevState, second: inputSecond };
      onInputChange(newState);
      return newState;
    });
  }

  return (
    <HStack >
      <InputGroup>
        <InputLeftAddon>
          Hour
        </InputLeftAddon>
        <NumberInput defaultValue={0} precision={0} min={0} max={255} value={inputValues.hour} onChange={handleHour}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>


      <InputGroup>
        <InputLeftAddon>
          Minute
        </InputLeftAddon>
        <NumberInput defaultValue={0} precision={0} min={0} max={59} value={inputValues.minute} onChange={handleMinute}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>



      <InputGroup>
        <InputLeftAddon>
          Second
        </InputLeftAddon>
        <NumberInput defaultValue={0} precision={0} min={0} max={59} value={inputValues.second} onChange={handleSecond}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>


    </HStack>
  );
};
