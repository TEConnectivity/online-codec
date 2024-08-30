import { HStack, Select, Text } from "@chakra-ui/react";
import { CharacTypeMP, WindowRequestType } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";
import { preset_list } from "./PresetSelection";
import { window_list } from "./WindowConfiguration";


interface ChildrenProps {
  onInputChange: (data: WindowRequestType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<WindowRequestType>({
    window_id: 1,
    preset_id: 0,
    type: CharacTypeMP.WINDOW_REQUEST,
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
    else if (source === "window_id") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, window_id: parsedInput as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 };
        onInputChange(newState);
        return newState;
      })
    }


  };


  return (
    <>
      <Text> Request the configuration of the selected window : </Text>

      <HStack>
        <Select value={inputValues.preset_id} onChange={(ev) => handleChange("preset_id", ev.target.value)} >
          {preset_list}
        </Select>
        <Select value={inputValues.window_id} onChange={(ev) => handleChange("window_id", ev.target.value)} >
          {window_list}
        </Select>
      </HStack>

    </>
  );
};


