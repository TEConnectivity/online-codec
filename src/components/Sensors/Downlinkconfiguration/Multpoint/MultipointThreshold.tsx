import { Checkbox, CheckboxGroup, HStack, NumberInput, NumberInputField, Select, Stack, Text, Tooltip } from "@chakra-ui/react";
import { CharacTypeMP, Multipoint_Threshold_ID_DATA, MultipointThresholdHL } from "@te-connectivity/iot-codec";
import { useState } from "react";


interface ChildrenProps {
  onInputChange: (data: MultipointThresholdHL) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<MultipointThresholdHL>({
    auto_clear: false,
    set_ble_mode: false,
    set_lora_mode: false,
    direction: "above",
    enabled: true,
    event_flag: false,
    id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1,
    ble_mode: "burst+periodic",
    lora_mode: "on_measurement",
    level: 0,
    type: CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI,
  });


  function handleCheckbox(checkboxgroup: string[]) {
    const possible_values = ['enabled', 'auto_clear', 'set_lora_mode'];


    setInputValues(prevValues => {
      const newState = {
        ...prevValues, ...possible_values.reduce((acc, key) => {
          acc[key] = checkboxgroup.includes(key);
          return acc;
        }, {} as { [key: string]: boolean })
      };
      onInputChange(newState);
      return newState;
    })
  }

  function handleChange(source: string, input: string) {

    if (source === "direction") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, direction: input as "above" | "below" };
        onInputChange(newState);
        return newState;
      })
    }
    if (source === "level") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, level: parseInt(input) };
        onInputChange(newState);
        return newState;
      })
    }
    if (source === "id_data") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, id_data: parseInt(input) };
        onInputChange(newState);
        return newState;
      })
    }
  }

  return (
    <>
      <Text p={2}> Change the configuration of a given threshold : </Text>

      <Stack >

        <Select value={inputValues.id_data} onChange={(ev) => handleChange("id_data", ev.target.value)} >
          {Object.entries(Multipoint_Threshold_ID_DATA)
            .filter(([key]) => isNaN(Number(key))) // Filter out reverse-mapping entries
            .map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))
          }
        </Select>

        <HStack>

          <CheckboxGroup onChange={handleCheckbox} colorScheme='orange'>
            <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Checkbox value='enabled'><Tooltip label="If true, the threshold is enabled.">Threshold Enable</Tooltip></Checkbox>
              <Checkbox value='auto_clear'><Tooltip label="If true, the threshold is automatically cleared when the value no longer exceed the target value. If false, the state configured (measurement interval, comm mode etc...) remains enabled until a manual deactivation by the user.">Auto Clear</Tooltip></Checkbox>
              <Checkbox value='set_lora_mode'><Tooltip label="If false, the value 'LoRa Comm Mode' is not taken into account when the threshold is triggered. In other words, the sensors does not change its LoRa communication mode.">Action : Communication mode (LoRa)</Tooltip></Checkbox>
            </Stack>
          </CheckboxGroup>

        </HStack>
        <Text>Level :</Text>
        <HStack>
          <NumberInput onChange={(result) => handleChange("level", result)} defaultValue={0} precision={0} min={0} max={100000} >
            <NumberInputField />
          </NumberInput>
          <Text>is</Text>
          <Select value={inputValues.direction} onChange={(ev) => handleChange("direction", ev.target.value)} >
            <option value={"above"}>Above (data32 {">"} above)</option>
            <option value={"below"}>Below (data32 {"<"} above)</option>
          </Select>
        </HStack>
        {inputValues.set_lora_mode &&
          <Select value={inputValues.lora_mode} onChange={(ev) => handleChange("comm_mode", ev.target.value)} >
            <option value={"on_measurement"}>On measurement</option>
          </Select>}
      </Stack>
    </>
  );
};
