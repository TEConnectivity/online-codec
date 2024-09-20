import { List, ListIcon, ListItem, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { MdDangerous } from "react-icons/md";

export default function App() {


  return (
    <>

      <Table colorScheme="blue">

        <Thead>
          <Tr>
            <Th>Sensor</Th>
            <Th>SW Version</Th>
            <Th>Encoding</Th>
            <Th>Decoding</Th>

          </Tr>
        </Thead>

        <Tbody>

          <Tr >
            <Td>8931N </Td>
            <Td>4.0.x (<i>Multipoint</i>)</Td>
            <Td>✅ (Beta)</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>8911N</Td>
            <Td>4.0.x (<i>Multipoint</i>)</Td>
            <Td>✅ (Beta)</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>8931N</Td>
            <Td>2.x.x</Td>
            <Td>❌</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>8911N</Td>
            <Td>1.x.x</Td>
            <Td>❌</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>59XXN</Td>
            <Td>3.5.0 (<i>Singlepoint</i>)</Td>
            <Td>✅</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>69XXN</Td>
            <Td>3.5.0 (<i>Singlepoint</i>)</Td>

            <Td>✅</Td>
            <Td>✅</Td>
          </Tr>
          <Tr >
            <Td>79XXN</Td>
            <Td>3.5.0 (<i>Singlepoint</i>)</Td>
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
