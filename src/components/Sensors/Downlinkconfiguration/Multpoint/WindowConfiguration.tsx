import { Checkbox, HStack, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Stack, Text } from "@chakra-ui/react";
import { CharacTypeMP, WindowConfigurationType } from "@te-connectivity/iot-codec";
import { useState } from "react";


interface ChildrenProps {
  onInputChange: (data: WindowConfigurationType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<WindowConfigurationType>({
    enable: true,
    frequency_max: 128,
    frequency_min: 0,
    peak_count: 3,
    preset_id: 0,
    window_id: 1,
    type: CharacTypeMP.WINDOW_CONFIGURATION,
  });


  function handleCheckbox(checked: boolean) {
    setInputValues(prevValues => {
      const newState = { ...prevValues, enable: checked };
      onInputChange(newState);
      return newState;
    })
  }

  function handleChange(source: string, input: string) {

    const parsedInput = parseInt(input)

    if (source === "freq_min") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, frequency_min: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "freq_max") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, frequency_max: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "preset_id") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, preset_id: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "window_id") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, window_id: parsedInput as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 };
        onInputChange(newState);
        return newState;
      })
    }
  };


  return (
    <>
      <Text p={2}> Change the configuration of a given preset : </Text>

      <Stack >

        <HStack>

          <Select value={inputValues.window_id} onChange={(ev) => handleChange("window_id", ev.target.value)} >
            {window_list}
          </Select>
          <Select value={inputValues.preset_id} onChange={(ev) => handleChange("preset_id", ev.target.value)} >
            {preset_list}
          </Select>
          <Checkbox onChange={(ev) => handleCheckbox(ev.target.checked)} isChecked={inputValues.enable} >Enable</Checkbox>

        </HStack>

        <HStack >
          <InputGroup>
            <InputLeftAddon>
              Frequency min
            </InputLeftAddon>
            <NumberInput precision={0} min={0} max={20800} value={inputValues.frequency_min} onChange={(value) => handleChange("freq_min", value)}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>


          <InputGroup>
            <InputLeftAddon>
              Frequency max
            </InputLeftAddon>
            <NumberInput precision={0} min={0} max={20800} value={inputValues.frequency_max} onChange={(value) => handleChange("freq_max", value)}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>


        </HStack>
      </Stack>
    </>
  );
};



const preset_list = <> <optgroup label="User Preset">
  <option value='0'>User Preset 0</option>
  <option value='1'>User Preset 1</option>
  <option value='2'>User Preset 2</option>
  <option value='3'>User Preset 3</option>
  <option value='4'>User Preset 4</option>
  <option value='5'>User Preset 5</option>
  <option value='6'>User Preset 6</option>
  <option value='7'>User Preset 7</option>
  <option value='8'>User Preset 8</option>
  <option value='9'>User Preset 9</option>
  <option value='10'>User Preset 10</option>
  <option value='11'>User Preset 11</option>
  <option value='12'>User Preset 12</option>
  <option value='13'>User Preset 13</option>
  <option value='14'>User Preset 14</option>
  <option value='15'>User Preset 15</option>
</optgroup></>

export const window_list = <>
  <option value={1}>Window 1</option>
  <option value={2}>Window 2</option>
  <option value={3}>Window 3</option>
  <option value={4}>Window 4</option>
  <option value={5}>Window 5</option>
  <option value={6}>Window 6</option>
  <option value={7}>Window 7</option>
  <option value={8}>Window 8</option></>

