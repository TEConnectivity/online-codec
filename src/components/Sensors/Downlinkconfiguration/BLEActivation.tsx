import { Checkbox, Link, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Stack, Text, UnorderedList, useBoolean } from "@chakra-ui/react";
import { BLEActivationType } from "../../../shared/Schemas";

interface ChildrenProps {
  onInputChange: (data: BLEActivationType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [bleActivated, bleActivatedToggle] = useBoolean(true);

  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handleCheckBoxChange(checked: boolean) {
    bleActivatedToggle.toggle()
    onInputChange({ checked: checked })
  }


  return (
    <>
      <Text>
        <Popover placement="bottom">
          <PopoverTrigger>
            <Link color="teal.500" >Enable or disable BLE Advertising : </Link>
          </PopoverTrigger>
          <PopoverContent minW={{ base: "100%", lg: "max-content" }}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Please note the following :</PopoverHeader>
            <PopoverBody>
              <Text py='2'>
                <UnorderedList>
                  <ListItem>If previously enabled, the BLE adv can be stopped with this frame </ListItem>
                  <ListItem>If user send “BLE enable” command when BLE is already active duration will be reset to 7 days.</ListItem>
                  <ListItem>Ble will advertise in periodic mode with a ADV interval of 1s.</ListItem>
                  <ListItem>"BLE Activation" characheristic remains at 1 for the duration.</ListItem>
                  <ListItem>Command “BLE Activation over Lora” is ignored during the preliminary phase.</ListItem>
                </UnorderedList>
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Text>

      <Stack spacing={[1, 5]} direction={['column', 'row']}>
        <Checkbox onChange={(ev) => handleCheckBoxChange(ev.target.checked)} isChecked={bleActivated} >BLE</Checkbox>
      </Stack>

    </>
  );
};
