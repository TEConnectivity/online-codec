import { Box, FormControl, FormHelperText, FormLabel, HStack, Radio, RadioGroup, Stack, StackDivider, Text, Tooltip, VStack } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import * as React from "react";

import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Characteristic, FirmwareVersion, Operation, DeviceModel, UserPayloadType, V3_5, V4_1, V4_1_4, V5_2, FirmwareSupportMap } from "@te-connectivity/iot-codec";
import EncodedFrameOutput from "../EncodedFrameOutput";

import UserPayload from "./UserPayload";


function getArrayOperation(charac: Characteristic) {
  var arrayOutput = charac.lora.split("|")
  // If the array is empty by default split will return [""] so an array with length of 1, i get rid of that
  if (arrayOutput[0] === "") return []
  else return arrayOutput
}

interface AppProps {
  family: DeviceModel;
  fwVersion: FirmwareVersion;
}


export default function App(props: AppProps) {

  // For radio button, will hold r / w / wr
  const [operation, setCharacOperation] = React.useState<string>("")

  // Will hold the charac object
  const [charac, setCharac] = React.useState<Characteristic>()

  let CHARAC_DATABASE: Characteristic[] = [];


  const db = (FirmwareSupportMap as unknown as Record<
    FirmwareVersion,
    Partial<Record<DeviceModel, Record<string, Characteristic>>>
  >)[props.fwVersion]?.[props.family];


  if (db) {
    CHARAC_DATABASE = Object.values(db);
  }


  // Clear charac when sensor family or firmware version changes
  React.useEffect(() => {
    setCharac(undefined);
    setCharacOperation("");
  }, [props.family, props.fwVersion])



  function handleCharacChange(charac_name: string) {

    // Reset charac operation if the user chose another charac
    setCharacOperation("")

    console.log(charac)

    setCharac(CHARAC_DATABASE.find(charac => charac.charac_name === charac_name) as Characteristic);


  }


  function characSelected() {


    // Si une charac est choisi ET quil existe au moins une operation LoRa sur la charac, alors on affiche les boutons radios
    if (charac) {
      if (getArrayOperation(charac).length !== 0) {

        return <Box>
          <Text pb="10px">Operation type</Text>
          <HStack>
            <RadioGroup onChange={setCharacOperation} value={operation}>
              <Stack direction='row'>
                {getArrayOperation(charac).map((_operation, op_id) => (
                  <Radio checked={operation === _operation} key={op_id} value={_operation}>{displayOperationHumanFriendly(_operation)}</Radio>
                ))
                }
              </Stack>
            </RadioGroup>
            <Tooltip label="Read : A simple read, expect an answer, Write: Edit configuration, no answer from the sensor, Write+Read : Write, then the sensor sends back the new value." placement="right" fontSize='md'>
              <QuestionOutlineIcon ml={"10px"} />
            </Tooltip>
          </HStack>
        </Box>

      } else {

        return <Text color="tomato" fontSize="18px">Sorry, this characteristic is not possible to configure through LoRa ! Please use BLE.</Text>

      }

    }
  }

  return (
    <VStack pt="10px" w="full" divider={<StackDivider borderColor='gray.200' />}>

      {/* Select characteristic */}
      <FormControl>
        <FormLabel>Downlink Command</FormLabel>
        <AutoComplete key={`${props.family}-${props.fwVersion}`} restoreOnBlurIfEmpty={false} suggestWhenEmpty onChange={handleCharacChange} openOnFocus>
          <AutoCompleteInput variant="filled" />
          <AutoCompleteList>
            {CHARAC_DATABASE.map((charac, cid) => (
              <AutoCompleteItem
                key={`option-${cid}`}
                value={charac.charac_name}
                textTransform="capitalize"
              >
                {charac.charac_name + " | " + charac.uuid}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText>Not all characteristic are available from LoRa</FormHelperText>
      </FormControl>

      {/* Select Operation (r/w/wr) */}
      {characSelected()}

      {/* If READ is selected :  generate downlink frame */}
      {(charac && operation === Operation.READ) && <EncodedFrameOutput charac={charac} family={props.family} operation={operation} payload={{} as UserPayloadType}></EncodedFrameOutput>}


      {/* If WRITE or WRITE+READ is selected : generate userPayload component frame */}
      {(charac && (operation === Operation.WRITE || operation === Operation.WRITEREAD)) && <UserPayload family={props.family} charac={charac} operation={operation} />}


    </VStack>



  );
};


function displayOperationHumanFriendly(input: string): string {
  switch (input) {
    case ("r"):
      return "Read"
    case ("w"):
      return "Write"
    case ("wr"):
      return "Write+Read"
    case ("n"):
      return "Notify"
    default:
      return ""
  }
}