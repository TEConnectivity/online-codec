import { Link, ListItem, OrderedList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";



interface MyComponentProps {
  children: string;
}

export default function App({ children }: MyComponentProps) {


  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Link color="teal.500" >{children}</Link>
      </PopoverTrigger>
      <PopoverContent minW={{ base: "100%", lg: "max-content" }}
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Usage : </PopoverHeader>
        <PopoverBody>


          <Text py='2'>
            Configure your threshold with the following order (4 frames needs to be sent) :
            <OrderedList>
              <ListItem>Configure the level of your threshold (when it will trigger)</ListItem>
              <ListItem>(Optional) Configure the target measurement interval once it is triggered (e.g. going from 4h to 1h)</ListItem>
              <ListItem>(Optional) Configure the target communication mode once it is triggered (e.g. enable BLE burst/silent mode, change LoRa comm mode...)</ListItem>
              <ListItem>Send the final configuration frame which allow you to enable the threshold and activate other features (flag, auto clear, condition...)</ListItem>
            </OrderedList>
          </Text>






        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
