import { InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { CharacTypeSP, DatalogArrayType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useEffect, useState } from "react";



interface ChildrenProps {
  onInputChange: (data: DatalogArrayType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<DatalogArrayType>({
    datalog_type: 0,
    index: 0,
    length: 1,
    type: CharacTypeSP.DATALOG_DATA,
  });

  const [maxValue, setMaxValue] = useState(120);

  const maxIndex = 4095;


  // Appelé dès que maxValues change pour mettre a jour correctement le numberInput, sinon il faut attendre le prochain re-render
  useEffect(() => {
    handleLengthChange(inputValues.length.toString())
    // eslint-disable-next-line
  }, [maxValue]);


  // Callback function, when the user edit the form, the payload is automatically regenerated

  function handleTypeChange(datalog_type: string) {
    switch (datalog_type) {
      case "0":
        setMaxValue(120)
        break;
      case "1":
        setMaxValue(60)
        break;
      case "2":
        setMaxValue(40)
        break;
    }

    setInputValues(prevState => {
      const newState = { ...prevState, datalog_type: parseInt(datalog_type) };
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
    <VStack direction={['column', 'row']} >

      <Text>Read the datalog, from : </Text>

      <RadioGroup onChange={handleTypeChange} value={inputValues.datalog_type.toString()} >
        <Stack direction={['column', 'row']}>
          <Radio value='0'>Secondary sensor</Radio>
          <Radio value='1'>Primary sensor</Radio>
          <Radio value='2'>Both</Radio>
        </Stack>
      </RadioGroup>


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


    </VStack>
  );
};
