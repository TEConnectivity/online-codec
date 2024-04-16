import { HStack, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { clamp } from "framer-motion";
import { useState } from "react";
import { zeroPadding } from "../../../../shared/Helper";

interface Props {
  setThresholdConfig: CallableFunction
  thresholdConfig: { id_data: string, param_sel: string, data32: string }
  onInputChange: CallableFunction
}

export default function App(props: Props) {


  const [inputValues, setInputValues] = useState({
    hour: '0',
    minute: '0',
    second: '0',
  });

  function handleNewState(state: any) {
    setInputValues(state)

    let hour = parseInt(state.hour, 10).toString(16)
    hour = zeroPadding(hour, 2)

    let minute = parseInt(state.minute, 10).toString(16)
    minute = zeroPadding(minute, 2)

    let second = parseInt(state.second, 10).toString(16)
    second = zeroPadding(second, 2)

    let newData32 = hour + minute + second + "00"

    var newState = { id_data: props.thresholdConfig.id_data, param_sel: props.thresholdConfig.param_sel, data32: newData32 }
    props.setThresholdConfig(newState)
    props.onInputChange(newState)
  }

  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handleHour(inputHour: string) {

    var newState = { hour: clamp(0, 255, parseInt(inputHour)), minute: inputValues.minute, second: inputValues.second }
    handleNewState(newState)
  }
  function handleMinute(inputMinute: string) {
    var newState = { hour: inputValues.hour, minute: clamp(0, 59, parseInt(inputMinute)), second: inputValues.second }
    handleNewState(newState)
  }
  function handleSecond(inputSecond: string) {
    var newState = { hour: inputValues.hour, minute: inputValues.minute, second: clamp(0, 59, parseInt(inputSecond)) }
    handleNewState(newState)
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
