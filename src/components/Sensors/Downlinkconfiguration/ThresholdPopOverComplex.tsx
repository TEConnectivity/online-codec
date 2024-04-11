import { Popover, Text, Image, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Link, Card, CardBody, Heading, Stack, HStack, ListItem, UnorderedList, Code } from "@chakra-ui/react";
import complex_threshold from "../../../img/complex_threshold.png"



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
        <PopoverBody>
          <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
          >
            <Image
              objectFit='cover'
              maxW={{ base: "100%", sm: '500px' }}
              src={complex_threshold}
              alt='Caffe Latte'
            />

            <Stack>
              <CardBody>
                <Heading size='md'>Complex Threshold</Heading>

                <Text py='2'>
                  With a second threshold, you can detect the following situtation :
                  <UnorderedList>
                    <ListItem>When the PRIMARY sensor go above/below a first, then a second value</ListItem>
                    <ListItem>When the SECONDARY sensor go above/below a first, then a second value</ListItem>
                    <ListItem>When the PRIMARY sensor go out-of-range <Code children="(threshold1 < value < threshold2)"/></ListItem>
                    <ListItem>When the SECONDARY sensor go out-of-range <Code children="(threshold1 < value < threshold2)"/></ListItem>
                  </UnorderedList>
                  Enabling a second threshold does nothing special in itself. It simply add a new detection.
                </Text>
              </CardBody>


            </Stack>
          </Card>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
