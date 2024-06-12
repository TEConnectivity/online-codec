import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Input, InputGroup, InputLeftAddon, ListItem, NumberInput, NumberInputField, StackDivider, Switch, Text, UnorderedList, VStack, useBoolean } from '@chakra-ui/react';
import { base64ToHex, hexStringToUint8Array } from '@te-connectivity/iot-codec';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { te_decoder } from '../submodules/ttn-payload-formater/TnnJsDecoder/TE_TtnDecoder';

export default function App() {

  const [isBase64, setIsBase64] = useState(false)

  // Contient le champ non parse
  const [input, setInput] = useState("")

  const [fPort, setFPort] = useState("10")

  // Contient le texte affiche en syntax higlhight
  const [decodedFrame, setDecodedFrame] = useState({})



  // Error handling
  const [isInputError, setIsInputError] = useBoolean(false)

  const [errorMessage, setErrorMessage] = useState("")



  function handleInputChange(input: string) {

    input = input.trim().replace(/\s/g, '')


    parseInput(input, isBase64)
    setInput(input)

  }

  /** Check string is not half octet size
   * 
   */
  function checkInputLength(input: string, isBase64: boolean) {
    if (isBase64) {
      return true;
    }
    else {
      if (input.length % 2 !== 0) {
        return false
      }
      else {
        return true;
      }
    }

  }

  function parseInput(_input = input, _isBase64 = isBase64, _fPort = fPort) {
    if (_input.length === 0) {
      setDecodedFrame({})
      setIsInputError.off()
      return false
    }



    const base64Regex = /^[0-9a-fA-F]+$/;

    if (!_isBase64 && !base64Regex.test(_input)) {
      setDecodedFrame({})
      setErrorMessage("The HEX string is invalid. Maybe you copied pasted Base64 instead ?")
      setIsInputError.on()
      return false
    }


    try {
      var base64_decoded_input = _isBase64 ? base64ToHex(_input) : _input
      if (checkInputLength(base64_decoded_input, _isBase64)) {
        setIsInputError.off()
        setDecodedFrame(te_decoder(hexStringToUint8Array(base64_decoded_input), parseInt(_fPort)))
      }
      else {
        setErrorMessage("Hex string length must be pair (no semi byte) ")
        setIsInputError.on()
      }
    } catch {
      setIsInputError.on()
      setErrorMessage("Invalid Base64 String")
    }

  }


  function handleToggleChange(checked: boolean) {
    if (checked)
      setIsBase64(true)
    else
      setIsBase64(false)

    parseInput(input, checked)


  }

  function handlefPortChange(fPort: string) {
    setFPort(fPort)
    parseInput(input, isBase64, fPort)
  }


  return (
    <VStack align='flex-start'>

      <Text m="10px">Enter your uplink frame </Text>

      <Accordion w={"full"} allowToggle>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                Frame examples
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <UnorderedList>

              <ListItem>Vibration sensor : Multipoint (fPort 10) :                <UnorderedList>
                <ListItem>Frame Format 0 : 152F01000000097907000C267F0B2700002680FF68267F0B2700002680FF68267F0B2700002680FF68 </ListItem>
                <ListItem>Frame Format 1 (default) : 152F01000000092E44000C26A9001C00BD127F000900DA000A00D9000800D70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 </ListItem>
                <ListItem>Frame Format 2 : 152F01000000097984000C26A9001C00BD0A013B402B64046B80BC600F7A031B8033181254026A600538 </ListItem>

              </UnorderedList></ListItem>

              <ListItem>Humidity, Temperature or Pressure sensor : SinglePoint (fPort 10) :
                <UnorderedList>
                  <ListItem>Humidity : 14221064086309EE00000D09 </ListItem>
                </UnorderedList>
              </ListItem>

            </UnorderedList>

          </AccordionPanel>
        </AccordionItem>

      </Accordion>

      <InputGroup>
        <InputLeftAddon w={"8rem"} p="0px">
          <Switch p="10px" onChange={(ev) => handleToggleChange(ev.target.checked)}>Base64</Switch>
        </InputLeftAddon>
        <Input value={input} isInvalid={isInputError} errorBorderColor='crimson' onChange={(ev) => handleInputChange(ev.target.value)} placeholder={isBase64 ? "V2l0Y2hlcjMgYmVzdCBnYW1lIGV2ZXI=" : "AABBCCDDEEFF"} />
      </InputGroup>

      {/* Message d'erreur d'input */}
      {isInputError && <Text>{errorMessage}</Text>}

      <InputGroup >
        <InputLeftAddon justifyContent={"center"} w={"8rem"} >
          fPort
        </InputLeftAddon>
        <NumberInput w={"full"} value={fPort} min={0} max={255} onChange={handlefPortChange} >
          <NumberInputField />
        </NumberInput>

      </InputGroup>

      <StackDivider />


      {/* Si il n'y a pas d'erreur d'input */}
      {!isInputError &&

        <SyntaxHighlighter language="javascript" >
          {JSON.stringify(decodedFrame, null, " ")}
        </SyntaxHighlighter>

      }


    </VStack>
  );
};
