import { NumberInput, NumberInputField, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { floatToHexString } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";

interface Props {
  setThresholdConfig: CallableFunction
  thresholdConfig: { id_data: string, param_sel: string, data32: string }
  onInputChange: CallableFunction

}


export default function App(props: Props) {

  // For radio button, will hold r / w / wr
  const [measureType, setMeasureType] = useState<string>("h")


  // If humidity, max clamp to 100%
  const maxClamp = (measureType === "h") ? 100 : 10000000

  // if Pression, two decimal precision (float)
  // If Humidity, two decimal precision (0.01 %)
  // If Temperature, two decimal precision (0.01 °C)
  const precision = 2



  function handleTHSLevelChange(value: string) {

    let parsedValue;
    if (measureType === "p") {
      parsedValue = parseFloat(value)
      parsedValue = floatToHexString(clamp(0, maxClamp, parsedValue))
    } else {
      // Int values are interpreted as (value received / 100)
      parsedValue = Math.round(parseFloat(value) * 100)
      parsedValue = clamp(0, maxClamp * 100, parsedValue).toString(16)
      console.log(parsedValue)

    }

    var newState = { id_data: props.thresholdConfig.id_data, param_sel: props.thresholdConfig.param_sel, data32: parsedValue }
    props.setThresholdConfig(newState)
    props.onInputChange(newState)
  }

  return (
    <>
      <Text>Change the threshold level (value is applicable for delta or simple threshold):</Text>

      {/* Si le threshold est sur un mainSensor alors on affiche le choix entre pression humidity temperature */}
      {["00", "01", "04", "05"].includes(props.thresholdConfig.id_data) &&
        <RadioGroup onChange={setMeasureType} value={measureType}>
          <Stack direction='row'>
            <Radio value={"h"}>Humidity</Radio>
            <Radio value={"p"}>Pression</Radio>
            <Radio value={"t"}>Temperature</Radio>
          </Stack>
        </RadioGroup>}

      <NumberInput onChange={handleTHSLevelChange} defaultValue={0} precision={precision} min={0} max={maxClamp} >
        <NumberInputField />
      </NumberInput>
    </>
  );
};
