import { Checkbox, HStack, Select, Text, useBoolean } from "@chakra-ui/react";
import { CharacTypeMP, PresetSelectionType } from "@te-connectivity/iot-codec";
import { ChangeEvent, useState } from "react";



interface ChildrenProps {
  onInputChange: (data: PresetSelectionType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {

  const [slotOne, setSlotOne] = useState<string>("0");
  const [slotTwo, setSlotTwo] = useState<string>("0");
  const [rotating, setRotating] = useBoolean(false);



  function handlePresetChange(event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value)

    var newState: PresetSelectionType
    if (event.target.name === "slotOne") {
      setSlotOne(event.target.value);
      newState = { main_preset: parseInt(event.target.value), type: CharacTypeMP.PRESET_SELECTION }
      if (rotating)
        newState.secondary_preset = parseInt(slotTwo);
    }
    else if (event.target.name === "slotTwo") {
      setSlotTwo(event.target.value)
      newState = { main_preset: parseInt(slotOne), secondary_preset: parseInt(event.target.value), type: CharacTypeMP.PRESET_SELECTION }
    }
    else {
      // Rotating
      setRotating.toggle()

      const target = event.target as HTMLInputElement
      if (target.checked)
        newState = { main_preset: parseInt(slotOne), secondary_preset: parseInt(slotTwo), type: CharacTypeMP.PRESET_SELECTION }
      else
        newState = { main_preset: parseInt(slotOne), type: CharacTypeMP.PRESET_SELECTION }

    }

    console.log(newState)
    onInputChange(newState);

  };


  return (
    <>
      <Text>Select the preset you want to be used in your sensor. Enable the rotating mode to select two preset at once : </Text>
      <Checkbox p={"2"} onChange={(ev) => handlePresetChange(ev)} isChecked={rotating} >Rotating mode</Checkbox>

      <HStack>
        <Select name="slotOne" value={slotOne} onChange={handlePresetChange} >
          {preset_list}
        </Select>
        {rotating && <Select name="slotTwo" value={slotTwo} onChange={handlePresetChange} >
          {preset_list}
        </Select>}

      </HStack>

    </>
  );
};

export const preset_list = <> <optgroup label="User Preset">
  <option value='0'>User Preset 0</option>
  <option value='1'>User Preset 1</option>
  <option value='2'>User Preset 2</option>
  <option value='3'>User Preset 3</option>
  <option value='4'>User Preset 4</option>
  <option value='5'>User Preset 5</option>
  <option value='6'>User Preset 6</option>
  <option value='7'>User Preset 7</option>
  <option value='8'>User Preset 8</option>
  <option value='9'>User Preset 9</option>
  <option value='10'>User Preset 10</option>
  <option value='11'>User Preset 11</option>
  <option value='12'>User Preset 12</option>
  <option value='13'>User Preset 13</option>
  <option value='14'>User Preset 14</option>
  <option value='15'>User Preset 15</option>
</optgroup>

  <optgroup label="Factory default preset">
    <option value='64'>Factory Preset 64</option>
    <option value='65'>Factory Preset 65</option>
    <option value='66'>Factory Preset 66</option>
    <option value='67'>Factory Preset 67</option>
    <option value='68'>Factory Preset 68</option>
    <option value='69'>Factory Preset 69</option>
    <option value='70'>Factory Preset 70</option>
    <option value='71'>Factory Preset 71</option>
    <option value='72'>Factory Preset 72</option>
    <option value='73'>Factory Preset 73</option>
    <option value='74'>Factory Preset 74</option>
    <option value='75'>Factory Preset 75</option>
    <option value='76'>Factory Preset 76</option>
    <option value='77'>Factory Preset 77</option>
    <option value='78'>Factory Preset 78</option>
  </optgroup>
</>