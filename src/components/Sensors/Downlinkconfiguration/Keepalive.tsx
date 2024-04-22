import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Radio, RadioGroup, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  onInputChange: (data: { keepaliveInterval: string, keepaliveMode: string }) => void;

}


export default function App(props: Props) {


  const [keepaliveInterval, setKeepaliveInterval] = useState<string>("0")

  const [keepaliveMode, setKeepaliveMode] = useState<string>("0")

  // // Des le premier rendu
  // useEffect(() => {
  //   props.onInputChange({ keepaliveInterval: keepaliveInterval, keepaliveMode: keepaliveMode })
  // }); // le tableau de dépendances est vide, donc cette fonction s'exécutera uniquement après le premier rendu



  // Chakra onChange return value and not event, so we use a nested function to allow event to be visible
  const handleChange = (name: any) => (value: any) => {
    var newState;

    if (name === "interval") {
      setKeepaliveInterval(value);
      newState = { keepaliveInterval: value, keepaliveMode: keepaliveMode }
      props.onInputChange(newState)
    }
    else {
      setKeepaliveMode(value);
      newState = { keepaliveInterval: keepaliveInterval, keepaliveMode: value }
      props.onInputChange(newState)
    }

  }





  return (
    <>
      <Text m={"1rem"}><Tooltip placement="left" label="Default is 24h. A keepalive is sent when you configure it through a downlink frame."><QuestionOutlineIcon mx={"0.5rem"} /></Tooltip>Keepalive interval :</Text>

      <RadioGroup onChange={handleChange("interval")} value={keepaliveInterval}>
        <Stack direction={['column', 'row']}>
          <Radio value={"0"}>Keep Alive every 24h</Radio>
          <Radio value={"1"}>Keep Alive every 12h</Radio>
          <Radio value={"2"}>Keep Alive every 8h</Radio>
          <Radio value={"3"}>Keep Alive every 4h</Radio>
          <Radio value={"4"}>Keep Alive every 2h</Radio>
        </Stack>
      </RadioGroup>

      <Text m={"1rem"}><Tooltip placement="left" label="Default value is Active."><QuestionOutlineIcon mx={"0.5rem"} /></Tooltip>Keepalive mode :</Text>

      <RadioGroup onChange={handleChange("mode")} value={keepaliveMode}>
        <Stack direction={['column', 'row']}>
          <Radio value={"0"}>Keep Alive Active and send every time</Radio>
          <Radio value={"1"}><Tooltip label="Keep Alive is Active and not emitted if a data is sent between Two keep alive. Keep alive interval is reset when a frame is sent.">Power efficient</Tooltip></Radio>
          <Radio value={"2"}><Tooltip label="Disable the keepalive completly.">Disable</Tooltip></Radio>
        </Stack>
      </RadioGroup>

    </>
  );
};
