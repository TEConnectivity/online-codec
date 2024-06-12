import { Checkbox, CheckboxGroup, Stack, Text, Tooltip } from "@chakra-ui/react";


interface Props {
  setThresholdConfig: CallableFunction
  thresholdConfig: { id_data: string, param_sel: string, data32: string }
  onInputChange: CallableFunction
}


export default function App(props: Props) {


  // Fonction pour gérer le changement de chaque case à cocher
  function handleCheckBoxChange(inputValues: string[]) {
    const options = ["EVT_FLAG", "ENABLE", "CONDITION", "AUTO_CLR", "meas_interv", "ble_adv_mode", "lora_comm_mode"]

    // Conversion from 0110101 to HEX
    var newData32 = options.map(option => (inputValues.includes(option) ? "1" : "0")).join("") + "0"
    // Conversion single byte to 4 byte padded with zero
    var fourBytes = parseInt(newData32, 2).toString(16).padEnd(8, "0")

    var newState = { id_data: props.thresholdConfig.id_data, param_sel: props.thresholdConfig.param_sel, data32: fourBytes }
    props.setThresholdConfig(newState)
    props.onInputChange(newState)


  };


  return (
    <>
      <Text>Edit the inner threshold config  : </Text>
      <CheckboxGroup onChange={handleCheckBoxChange} colorScheme='orange'>
        <Stack spacing={[1, 5]} direction={['column', 'row']}>
          <Checkbox value='EVT_FLAG'><Tooltip label="If true, a flag will be set to 1 in DevStatus field when threshold is triggered">Event Flag</Tooltip></Checkbox>
          <Checkbox value='ENABLE'><Tooltip label="If true, the threshold is enabled.">Threshold Enable</Tooltip></Checkbox>
          <Checkbox value='CONDITION'><Tooltip label='If true, the threshold fire when the sensor data is ABOVE the configured value. If false, it is BELOW.'>Condition</Tooltip></Checkbox>
          <Checkbox value='AUTO_CLR'><Tooltip label="If true, the threshold is automatically cleared when the value no longer exceed the target value. If false, the state configured (measurement interval, comm mode etc...) remains enabled until a manual deactivation by the user.">Auto Clear</Tooltip></Checkbox>
          <Checkbox value='meas_interv'><Tooltip label="If false, the value 'measurement interval' is not taken into account when the threshold is triggered. In other words, the sensors does not change its measurement interval.">Action : Measurement Interval</Tooltip></Checkbox>
          <Checkbox value='ble_adv_mode'><Tooltip label="If false, the value 'BLE Comm Mode' is not taken into account when the threshold is triggered. In other words, the sensors does not change its BLE communication mode.">Action : Advertising mode (BLE)</Tooltip></Checkbox>
          <Checkbox value='lora_comm_mode'><Tooltip label="If false, the value 'LoRa Comm Mode' is not taken into account when the threshold is triggered. In other words, the sensors does not change its LoRa communication mode.">Action : Communication mode (LoRa)</Tooltip></Checkbox>
        </Stack>
      </CheckboxGroup>
    </>
  );
};
