import { List, ListIcon, ListItem, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { MdDangerous } from "react-icons/md";

export default function App() {


  return (
    <>

      <Table colorScheme="blue">

        <Thead>
          <Tr>
            <Th>Sensor</Th>
            <Th>Encoding</Th>
            <Th>Decoding</Th>

          </Tr>
        </Thead>

        <Tbody>

          <Tr >
            <Td>8931 (4.0.1)</Td>
            <Td>❌</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>8911 (4.0.1)</Td>
            <Td>❌</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>59XX  (3.5.0)</Td>
            <Td>✅</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>69XX  (3.5.0)</Td>
            <Td>✅</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>79XX  (3.5.0)</Td>
            <Td>✅</Td>
            <Td>✅</Td>
          </Tr>
        </Tbody>

      </Table>

      <List m="10px" spacing={3}>
        <ListItem>
          <ListIcon as={MdDangerous} color='red.500' />
          All older sensors are not supported : 5600, U8900...
        </ListItem>
      </List>

    </>

  );
};
