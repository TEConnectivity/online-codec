import { Link, List, ListIcon, ListItem, Text, VStack } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";


export default function App() {


  return (
    <VStack flex={"start"}>
      <Text p={"10px"} fontSize="19px" >This website is open-source, the code is available on Git, alongside its coding & decoding libraries.</Text>
      <List m="10px" spacing={3}>
        <ListItem>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Encoding library (to generate downlink frames) : <Link color='teal.500' href="https://github.com/TEConnectivity/iot-codec" isExternal>Github</Link>
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color='green.500' />
          Decoding library (to decode uplinks frames) : <Link color='teal.500' href="https://github.com/TEConnectivity/ttn-decoder" isExternal>Github</Link>
        </ListItem>
      </List>
    </VStack>
  );
};
