import { Box, FormControl, FormHelperText, FormLabel, HStack, Radio, RadioGroup, Stack, StackDivider, Text, Tooltip, VStack } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import * as React from "react";

import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { encode } from "../../shared/EncoderLib";
import { Characteristic } from "../../shared/Schemas";
import EncodedFrameOutput from "../EncodedFrameOutput";
import { SP_Charac } from "./SP_charac";
import UserPayload from "./UserPayload";


function getArrayOperation(charac: Characteristic) {
  var arrayOutput = charac.lora.split("|")
  // If the array is empty by default split will return [""] so an array with length of 1, i get rid of that
  if (arrayOutput[0] === "") return []
  else return arrayOutput
}


export default function App() {



  // For radio button, will hold r / w / wr
  const [operation, setCharacOperation] = React.useState<string>()


  // Will hold the charac object
  const [charac, setCharac] = React.useState<Characteristic>()


  function handleCharacChange(charac_name: string) {

    // Reset charac operation if the user chose another
    setCharacOperation("")

    setCharac(SP_Charac.find(charac => charac.charac_name === charac_name) as Characteristic)


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
                  <Radio checked={operation === _operation} key={op_id} value={_operation}>{_operation.toUpperCase()}</Radio>
                ))
                }
              </Stack>
            </RadioGroup>
            <Tooltip label="R: Read, W: Write, WR : Write, then the sensor sends back the new value" placement="right" fontSize='md'>
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
        <AutoComplete onChange={handleCharacChange} openOnFocus>
          <AutoCompleteInput variant="filled" />
          <AutoCompleteList>
            {SP_Charac.map((charac, cid) => (
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
      {(charac && operation === "r") && <EncodedFrameOutput frame={encode(charac, operation, null)}></EncodedFrameOutput>}


      {/* If WRITE or WRITE+READ is selected : generate userPayload component frame */}
      {(charac && (operation === "w" || operation === "wr")) && <UserPayload charac={charac} operation={operation} />}


    </VStack>



  );
};
