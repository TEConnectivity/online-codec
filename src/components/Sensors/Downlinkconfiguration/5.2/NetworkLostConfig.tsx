import { HStack, InputGroup, InputLeftAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import { V5_2 } from "@te-connectivity/iot-codec";
import { clamp } from "framer-motion";
import { useState } from "react";


interface ChildrenProps {
  onInputChange: (data: V5_2.NetworkLostConfigType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [inputValues, setInputValues] = useState<V5_2.NetworkLostConfigType>({
    adr_ack_limit: 64,
    adr_ack_delay: 32,
    confirmed_nack_retry: 10,
    periodic_unjoin_delay: 744,
    type: V5_2.CharacTypeGen_5_2.NETWORK_LOST_CONFIG,
  });


  function handleChange(source: string, input: string) {

    const parsedInput = clamp(1, 65535, parseInt(input))

    if (source === "adr_ack_limit") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, adr_ack_limit: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "adr_ack_delay") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, adr_ack_delay: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "confirmed_nack_retry") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, confirmed_nack_retry: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }
    else if (source === "periodic_unjoin_delay") {
      setInputValues(prevValues => {
        const newState = { ...prevValues, periodic_unjoin_delay: parsedInput };
        onInputChange(newState);
        return newState;
      })
    }

  };


  return (
    <>
      <Text> Change the configuration of network parameters : </Text>

      <HStack >
        <InputGroup>
          <InputLeftAddon>
            ADR ACK Limit
          </InputLeftAddon>
          <NumberInput precision={0} min={2} max={127} value={inputValues.adr_ack_limit} onChange={(value) => handleChange("adr_ack_limit", value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>


        <InputGroup>
          <InputLeftAddon>
            ADR ACK Delay
          </InputLeftAddon>
          <NumberInput precision={0} min={2} max={127} value={inputValues.adr_ack_delay} onChange={(value) => handleChange("adr_ack_delay", value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>



        <InputGroup>
          <InputLeftAddon>
            Confirmed Non-ACK Retry
          </InputLeftAddon>
          <NumberInput precision={0} min={1} max={255} value={inputValues.confirmed_nack_retry} onChange={(value) => handleChange("confirmed_nack_retry", value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>

        <InputGroup>
          <InputLeftAddon>
            Periodic Unjoin Delay (hours)
          </InputLeftAddon>
          <NumberInput precision={0} min={1} max={65535} value={inputValues.periodic_unjoin_delay} onChange={(value) => handleChange("periodic_unjoin_delay", value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>


      </HStack>

    </>
  );
};

