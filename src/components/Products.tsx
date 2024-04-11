import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { MdCheckCircle, MdDangerous } from "react-icons/md";

export default function App() {


  return (

    <List m="10px" spacing={3}>
      <ListItem>
        <ListIcon as={MdCheckCircle} color='green.500' />
        Singlepoint sensors : Humidity, Temperature and Pressure (6XXX,7XXX,8XXX)
      </ListItem>
      <ListItem>
        <ListIcon as={MdCheckCircle} color='green.500' />
        Legacy Vibration (893X & 891X)
      </ListItem>
      <ListItem>
        <ListIcon as={MdCheckCircle} color='orange.500' />
        Coming Soon : New Multipoint Vibration sensors (8931N/8933N/8931EX/8933EX)
      </ListItem>
      {/* You can also use custom icons from react-icons */}
      <ListItem>
        <ListIcon as={MdDangerous} color='red.500' />
        All older sensors are not supported : 5600, U8900...
      </ListItem>
    </List>
  );
};
