import { HStack, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from "@chakra-ui/react";
import { CharacTypeMP, PresetConfigurationType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";


interface ChildrenProps {
  onInputChange: (data: PresetConfigurationType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<PresetConfigurationType>({
    preset_id: 0,
    frame_format: 0,
    bandwidth_mode: 0,
    meas_interval_hour: 0,
    meas_interval_minute: 1,
    meas_interval_second: 0,
    type: CharacTypeMP.PRESET_CONFIGURATION,
  });


  function handleChange(source: string, input: string) {

    const parsedInput = clamp(0, 255, parseInt(input))

    if (source === "hour") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, meas_interval_hour: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "minute") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, meas_interval_minute: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "second") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, meas_interval_second: parsedInput };
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
    else if (source === "frame_format") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, frame_format: parsedInput as 0 | 1 | 2 };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "bw_mode") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, bandwidth_mode: parsedInput as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 };
        onInputChange(newState);
        return newState;
      })
    }

  };


  return (
    <>
      <Text> Change the configuration of a given preset : </Text>

      <HStack>
        <Select value={inputValues.preset_id} onChange={(ev) => handleChange("preset_id", ev.target.value)} >
          {preset_list}
        </Select>
        <Select value={inputValues.frame_format} onChange={(ev) => handleChange("frame_format", ev.target.value)} >
          <option value={0}>Format 0</option>
          <option value={1}>Format 1</option>
          <option value={2}>Format 2</option>
        </Select>
        <Select value={inputValues.bandwidth_mode} onChange={(ev) => handleChange("bw_mode", ev.target.value)} >
          {bw_mode}
        </Select>

      </HStack>

      <HStack >
        <InputGroup>
          <InputLeftAddon>
            Hour
          </InputLeftAddon>
          <NumberInput defaultValue={0} precision={0} min={0} max={255} value={inputValues.meas_interval_hour} onChange={(value) => handleChange("hour", value)}>
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
          <NumberInput defaultValue={0} precision={0} min={0} max={59} value={inputValues.meas_interval_minute} onChange={(value) => handleChange("minute", value)}>
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
          <NumberInput defaultValue={0} precision={0} min={0} max={59} value={inputValues.meas_interval_second} onChange={(value) => handleChange("second", value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>


      </HStack>

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




const bw_mode = <> <optgroup label="User Preset">
  <option value='0'>Bandwidth Mode 0</option>
  <option value='1'>Bandwidth Mode 1</option>
  <option value='2'>Bandwidth Mode 2</option>
  <option value='3'>Bandwidth Mode 3</option>
  <option value='4'>Bandwidth Mode 4</option>
  <option value='5'>Bandwidth Mode 5</option>
  <option value='6'>Bandwidth Mode 6</option>
  <option value='7'>Bandwidth Mode 7</option>
  <option value='8'>Bandwidth Mode 8</option>
  <option value='9'>Bandwidth Mode 9</option>
  <option value='10'>Bandwidth Mode 10</option>
  <option value='11'>Bandwidth Mode 11</option>
  <option value='12'>Bandwidth Mode 12</option>
  <option value='13'>Bandwidth Mode 13</option>
  <option value='14'>Bandwidth Mode 14</option>
  <option value='15'>Bandwidth Mode 15</option>
</optgroup></>