import { HStack, Select, Text } from "@chakra-ui/react";
import { CharacTypeMP, PresetRequestType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";
import { preset_list } from "./PresetSelection";


interface ChildrenProps {
  onInputChange: (data: PresetRequestType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<PresetRequestType>({
    preset_id: 0,
    type: CharacTypeMP.PRESET_REQUEST,
  });


  function handleChange(source: string, input: string) {

    const parsedInput = clamp(0, 255, parseInt(input))

    if (source === "preset_id") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, preset_id: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }


  };


  return (
    <>
      <Text> Request the configuration of the selected preset : </Text>

      <HStack>
        <Select value={inputValues.preset_id} onChange={(ev) => handleChange("preset_id", ev.target.value)} >
          {preset_list}
        </Select>

      </HStack>

    </>
  );
};


