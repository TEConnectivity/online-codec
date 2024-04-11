import { Input, Text, VStack } from "@chakra-ui/react";

interface Props {
  frame: string
}

function toBase64(input: string) {
  return btoa(input.match(/\w{2}/g)!.map(function (a) { return String.fromCharCode(parseInt(a, 16)); }).join(""))
}



/**
 * Component which render the output encoded frame, in HEX & Base64 format
 */
export default function App(props: Props) {

  console.log("Generated dowlink frame...")

  return (
    <VStack width={"100%"} justifyContent={"flex-start"}>
      <Text>Frame : </Text>
      <Input isReadOnly value={props.frame}></Input>
      <Text>Base64 : </Text>
      <Input isReadOnly value={toBase64(props.frame)}></Input>
    </VStack>
  );
};
