import { Radio, RadioGroup, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { displayUint8ArrayAsHex } from "../../../../shared/Helper";

interface Props {
  setThresholdConfig: CallableFunction
  thresholdConfig: { id_data: string, param_sel: string, data32: string }
  onInputChange: CallableFunction
}


export default function App(props: Props) {


  const [bleMode, setBleMode] = useState<string>("ble-p")

  const [loraMode, setLoraMode] = useState<string>("lora-p")

  // useEffect(() => {
  //   // Modifier la valeur de data32 dès le premier rendu
  //   pushParent(format(bleMode, loraMode))
  // }); // le tableau de dépendances est vide, donc cette fonction s'exécutera uniquement après le premier rendu



  // Chakra onChange return value and not event, so we use a nested function to allow event to be visible
  const handleChange = (name: any) => (value: any) => {

    let newData32;

    if (name === "ble") {
      setBleMode(value);
      newData32 = format(value, loraMode)
    }
    else {
      setLoraMode(value);
      newData32 = format(bleMode, value)
    }

    pushParent(newData32)
  }

  function pushParent(data32: string) {
    var newState = { id_data: props.thresholdConfig.id_data, param_sel: props.thresholdConfig.param_sel, data32: data32 }
    props.setThresholdConfig(newState)
    props.onInputChange(newState)
  }


  function format(ble: string, lora: string) {
    var output = new Uint8Array(4)

    interface myDict { [index: string]: number; }
    let ble_mapping: myDict = { "ble-bp": 0, "ble-b": 1, "ble-s": 2, "ble-p": 3 }
    let lora_mapping: myDict = { "lora-p": 0, "lora-m": 2 }

    output[0] = ble_mapping[ble]
    output[1] = lora_mapping[lora]

    return displayUint8ArrayAsHex(output, "");
  }

  return (
    <>
      <Text>Change the BLE Advertising mode:</Text>

      <RadioGroup onChange={handleChange("ble")} value={bleMode}>
        <Stack direction='row'>
          <Radio value={"ble-bp"}><Tooltip label="Advertisement 15 times every 1s after measurement then every 10 sec">Burst + Periodic</Tooltip></Radio>
          <Radio value={"ble-b"}><Tooltip label="Advertisement 15 times every 1s only after a measurement.">Burst</Tooltip></Radio>
          <Radio value={"ble-s"}><Tooltip label="No advertisement included even after measurement.">Silent</Tooltip></Radio>
          <Radio value={"ble-p"}><Tooltip label="Periodic advertisement">Periodic</Tooltip></Radio>
        </Stack>
      </RadioGroup>

      <Text>Change the LoRa Advertising mode:</Text>

      <RadioGroup onChange={handleChange("lora")} value={loraMode}>
        <Stack direction='row'>
          <Radio value={"lora-p"}><Tooltip label="Send a frame every measurement">Periodic</Tooltip></Radio>
          <Radio isDisabled value={"lora-m"}><Tooltip label="">Merged</Tooltip></Radio>
        </Stack>
      </RadioGroup>

    </>
  );
};
