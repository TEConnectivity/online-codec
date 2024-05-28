import {
  Divider,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';

import { SP_Charac } from './Sensors/SP_charac';


export default function App() {


  return (
    <Flex flexDirection={'column'}>

      <Text p={"10px"} fontSize="19px" textAlign={"center"}>List given for illustratives purposes. Please refer to detailed spectech associated with each sensor for the full list.</Text>

      <Divider />
      <TableContainer>
        <Table variant='striped' colorScheme="blue">
          <TableCaption>List of configurable characheristics (contact us for an exhaustive documentation on the matter)</TableCaption>
          <Thead>
            <Tr>
              <Th>UUID</Th>
              <Th>Charac Name</Th>
              <Th isNumeric>Payload Size</Th>
              <Th>BLE Rights</Th>
              <Th>LoRa Rights</Th>
            </Tr>
          </Thead>
          <Tbody>

            {SP_Charac.map((charac, cid) => (
              <Tr key={cid}>
                <Td>{charac.uuid}</Td>
                <Td>{charac.charac_name}</Td>
                <Td isNumeric>{charac.payload_size}</Td>
                <Td>{charac.ble}</Td>
                <Td>{charac.lora}</Td>
              </Tr>
            ))}

          </Tbody>
          <Tfoot>
            <Tr>
              <Th>UUID</Th>
              <Th>Charac Name</Th>
              <Th isNumeric>Payload Size</Th>
              <Th>BLE Rights</Th>
              <Th>LoRa Rights</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <Text p={"10px"} >Legend : r (read), w (write), wr (write, then the sensors return back the value on the next window available), n (notify, BLE only)</Text>

    </Flex>
  );
};
