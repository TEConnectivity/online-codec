import { Checkbox, CheckboxGroup, Stack, Text, Tooltip } from "@chakra-ui/react";
import { AxisSelectionType, CharacTypeMP } from "@te-connectivity/iot-codec";



interface ChildrenProps {
  onInputChange: (data: AxisSelectionType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  // Fonction pour gérer le changement de chaque case à cocher
  function handleCheckBoxChange(inputValues: ("x" | "y" | "z")[]) {

    var newState: AxisSelectionType = { axis_selected: inputValues, type: CharacTypeMP.AXIS_SELECTION }
    onInputChange(newState)

  };


  return (
    <>
      <Text>Enable the axis you want : </Text>
      <CheckboxGroup onChange={handleCheckBoxChange} colorScheme='orange'>
        <Stack spacing={[1, 5]} direction={['column', 'row']}>
          <Checkbox value='x'><Tooltip label="Enable X axis (only on 3-axis sensor)">X</Tooltip></Checkbox>
          <Checkbox value='y'><Tooltip label="Enable Y axis (only on 3-axis sensor)">Y</Tooltip></Checkbox>
          <Checkbox value='z'><Tooltip label='Enable Z axis'>Z</Tooltip></Checkbox>
        </Stack>
      </CheckboxGroup>
    </>
  );
};
