import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Input, InputGroup, InputLeftAddon, Link, ListItem, NumberInput, NumberInputField, StackDivider, Switch, Text, UnorderedList, VStack, useBoolean } from '@chakra-ui/react';
import { base64ToHex, hexStringToUint8Array } from '@te-connectivity/iot-codec';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { te_decoder } from '../submodules/ttn-payload-formater/TnnJsDecoder/TE_TtnDecoder';

export default function App() {

  const vib_frame_old_8911N = "0a18a7040c00000009000a004336000100006300010001200101000105010100007e00010000b400000000e100000000b001000000f33600000091020000002b32000000a725000000c82800000068010000003d0e0000009501000000d23300000078060000001d31000000dd01000000e22f0000002037000000b01c000000"
  const vib_frame_old_8931N = "00095909880e010000480001000180000c00028002b0001000"
  const vib_frame0 = "152f000208630b9601000c006400C84E20"
  const vib_frame1 = "152F01000000092E44000C26A9001C00BD127F000900DA000A00D9000800D70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  const vib_frame2 = "152f000408630b3e81000c000000060000180000000400010000d0001c0003c000d0001b00038000d0001a8003600142002880051800cd0019c0033c00cd0019b0033800cd0019a8033600"
  const frameHumi = "14221064086309EE00000D09"

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
        let decoded_frame
        try {
          decoded_frame = te_decoder(hexStringToUint8Array(base64_decoded_input), parseInt(_fPort))
          setIsInputError.off()
          setDecodedFrame(decoded_frame)
        } catch {
          setIsInputError.on()
          setErrorMessage("Decoding error, contact TE")
        }
      }
      else {
        setErrorMessage("Hex string length must be pair (no semi byte) ")
        setIsInputError.on()
      }
    } catch {
      setIsInputError.on()
      setErrorMessage("Decoding error, contact TE")
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


  function fillFrame(frame: string, fPort: string): void {
    setIsBase64(false);
    setFPort(fPort);
    setInput(frame);

    parseInput(frame, false, fPort)
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

              <ListItem>Vibration sensor 4.x.x : Multipoint (fPort 10) :
                <UnorderedList>
                  <ListItem>Frame Format 0 : <Link color={"teal.500"} onClick={() => fillFrame(vib_frame0, "10")}>{vib_frame0}</Link></ListItem>
                  <ListItem>Frame Format 1 (default) :  <Link color={"teal.500"} onClick={() => fillFrame(vib_frame1, "10")}>{vib_frame1}</Link></ListItem>
                  <ListItem>Frame Format 2 :  <Link color={"teal.500"} onClick={() => fillFrame(vib_frame2, "10")}>{vib_frame2}</Link></ListItem>
                </UnorderedList>
              </ListItem>

              <ListItem>Humidity, Temperature or Pressure sensor : SinglePoint 3.x.x (fPort 10) :
                <UnorderedList>
                  <ListItem>Humidity : <Link color={"teal.500"} onClick={() => fillFrame(frameHumi, "10")}>{frameHumi}</Link></ListItem>
                </UnorderedList>
              </ListItem>

              <ListItem>8911N Legacy Firmware 1.x.x : <Link color={"teal.500"} onClick={() => fillFrame(vib_frame_old_8911N, "1")}>{vib_frame_old_8911N}</Link></ListItem>
              <ListItem>8931N Legacy Firmware 2.x.x : <Link color={"teal.500"} onClick={() => fillFrame(vib_frame_old_8931N, "5")}>{vib_frame_old_8931N}</Link></ListItem>


            </UnorderedList>

          </AccordionPanel>
        </AccordionItem>

      </Accordion>

      <InputGroup>
        <InputLeftAddon w={"8rem"} p="0px">
          <Switch p="10px" isChecked={isBase64} onChange={(ev) => handleToggleChange(ev.target.checked)}>Base64</Switch>
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
