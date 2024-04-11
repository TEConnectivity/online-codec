import { HStack, InputGroup, InputLeftAddon, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useState } from "react";

interface ChildrenProps {
  onInputChange: (data: { hour: string, minute: string, second: string }) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState({
    hour: '0',
    minute: '0',
    second: '0',
  });

  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handleHour(inputHour: string) {
    var newState = {hour:inputHour, minute: inputValues.minute, second:inputValues.second}
    setInputValues(newState)
    onInputChange(newState)
  }
  function handleMinute(inputMinute: string) {
    var newState = { hour: inputValues.hour, minute: inputMinute, second: inputValues.second }
    setInputValues(newState)
    onInputChange(newState)
  }
  function handleSecond(inputSecond: string) {
    var newState = { hour: inputValues.hour, minute: inputValues.minute, second: inputSecond }
    setInputValues(newState)
    onInputChange(newState)
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
