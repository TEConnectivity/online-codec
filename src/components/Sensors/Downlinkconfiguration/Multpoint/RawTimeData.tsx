import { InputGroup, InputLeftAddon, Link, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { CharacTypeMP, RawTimeDataType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";



interface ChildrenProps {
  onInputChange: (data: RawTimeDataType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<RawTimeDataType>({
    axis_selected: "z",
    index: 0,
    length: 1,
    type: CharacTypeMP.RAW_TIME_DATA,
  });


  const maxValue = 255;
  const maxIndex = 4095;


  // Callback function, when the user edit the form, the payload is automatically regenerated

  function handleAxisChange(axis_selected: ("x"|"y"|"z")) {
    setInputValues(prevState => {
      const newState = { ...prevState, axis_selected: axis_selected };
      onInputChange(newState);
      return newState;
    });

  }


  function handleIndexChange(index: string) {

    setInputValues(prevState => {
      const newState = { ...prevState, index: clamp(0, maxIndex, parseInt(index)) };
      onInputChange(newState);
      return newState;
    });

  }

  function handleLengthChange(length: string) {

    setInputValues(prevState => {
      const newState = { ...prevState, length: clamp(0, maxValue, parseInt(length)) };
      onInputChange(newState);
      return newState;
    });
  }


  return (
    <VStack >
      
      <Text>This command allow to request the raw time signal buffer. Only the last measurement can be requested. 
      </Text>
      <Text>
      A measurement is composed of 4096 samples. The size of the requested chunk should be configured depending on the network quality.
      </Text>

      <Text>Select axis : </Text>

      <RadioGroup onChange={handleAxisChange} value={inputValues.axis_selected.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value='x'>X</Radio>
          <Radio value='y'>Y</Radio>
          <Radio value='z'>Z</Radio>
        </Stack>
      </RadioGroup>

      <Stack direction={['column', 'row']}>

        <InputGroup>
          <InputLeftAddon>
            Index
          </InputLeftAddon>
          <NumberInput defaultValue={0} precision={0} min={0} max={4095} value={inputValues.index} onChange={handleIndexChange}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>

        <InputGroup  >
          <InputLeftAddon>
            Number of value to read
          </InputLeftAddon>
          <NumberInput defaultValue={0} precision={0} min={1} max={maxValue} value={inputValues.length} onChange={handleLengthChange}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>

    </Stack>

    <Text>The above request will generates an answer that is {inputValues.length*2 + 4} bytes long. Check with an <Link color='teal.500' href="https://avbentem.github.io/airtime-calculator/ttn/eu868/0" isExternal>airtime calculator</Link> to see if you will face fragmentation.</Text>


    </VStack>
  );
};
