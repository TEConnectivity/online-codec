import { List, ListItem, ListIcon } from "@chakra-ui/react";
import { MdCheckCircle, MdDangerous } from "react-icons/md";


export default function App() {


  return (
    <List m="10px" spacing={3}>
      <ListItem>
        <ListIcon as={MdCheckCircle} color='green.500' />
        Encoding library (to generate downlink frames) : link
      </ListItem>
      <ListItem>
        <ListIcon as={MdCheckCircle} color='green.500' />
        Decoding library (to decode uplinks frames) : link
      </ListItem>
    </List>
  );
};
