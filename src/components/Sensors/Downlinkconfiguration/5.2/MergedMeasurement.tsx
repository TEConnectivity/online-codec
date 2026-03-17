import { Checkbox, CheckboxGroup, HStack, NumberInput, NumberInputField, Stack, Text, Tooltip } from "@chakra-ui/react";
import { V5_2 } from "@te-connectivity/iot-codec";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: V5_2.MergedMeasurementType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V5_2.MergedMeasurementType>({
    measurement_number: 10,
    measurement_counter: false,
    timestamp: false,
    secondary_temperature: false,
    type: V5_2.CharacTypeSP_5_2.MERGE_MEASUREMENT,
  });


  function handleInputNumber(number: string) {

    setInputValues(prevValues => {
      const newState = { ...prevValues, measurement_number: parseInt(number) };
      onInputChange(newState);
      return newState;
    })

  }



  function handleCheckbox(values: string[]) {
    setInputValues(prevValues => {
      const newState = {
        ...prevValues,
        measurement_counter: false,
        timestamp: false,
        secondary_temperature: false,
      };

      values.forEach(v => {
        switch (v) {
          case "measurement_counter":
            newState.measurement_counter = true;
            break;
          case "timestamp":
            newState.timestamp = true;
            break;
          case "secondary_temperature":
            newState.secondary_temperature = true;
            break;
        }
      });

      onInputChange(newState);
      return newState;
    });
  }



  return (
    <>
      <Text>Configure the number of measurement in a batch : </Text>

      <NumberInput onChange={(result) => handleInputNumber(result)} value={inputValues.measurement_number} precision={0} min={1} max={50} >
        <NumberInputField />
      </NumberInput>
      <HStack>

        <CheckboxGroup onChange={handleCheckbox} colorScheme='orange'>
          <Stack spacing={[1, 5]} direction={['column', 'row']}>
            <Checkbox value="measurement_counter"><Tooltip >Measurement Counter</Tooltip></Checkbox>
            <Checkbox value="timestamp"><Tooltip >Timestamp</Tooltip></Checkbox>
            <Checkbox value="secondary_temperature"><Tooltip >Secondary Temperature</Tooltip></Checkbox>
          </Stack>
        </CheckboxGroup>

      </HStack>
    </>
  );
};
