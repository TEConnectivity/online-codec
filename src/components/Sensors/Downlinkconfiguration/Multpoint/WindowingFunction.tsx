import { HStack, Select, Text } from "@chakra-ui/react";
import { CharacTypeMP, WindowingFunctionType } from "@te-connectivity/iot-codec";



interface ChildrenProps {
  onInputChange: (data: WindowingFunctionType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  // Fonction pour gérer le changement de chaque case à cocher
  function handleChange(value: "hann" | "flattop" | "none") {

    var newState: WindowingFunctionType = { function: value, type: CharacTypeMP.WINDOWING_FUNCTION }
    onInputChange(newState)

  };


  return (
    <>
      <Text>Select the windowing function you want : </Text>
      <HStack>
        <Select onChange={(ev) => handleChange(ev.target.value as "hann" | "flattop" | "none")} >
          <option value='hann'>Hanning</option>
          <option value='flattop'>Flat-top</option>
          <option value='none'>Rectangular (none)</option>
        </Select>

      </HStack>
    </>
  );
};
