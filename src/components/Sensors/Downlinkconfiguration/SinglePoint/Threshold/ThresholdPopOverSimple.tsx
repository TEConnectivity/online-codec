import { Card, CardBody, Heading, Image, Link, ListItem, Popover, PopoverBody, PopoverContent, PopoverTrigger, Stack, Text, UnorderedList } from "@chakra-ui/react";
import basic_threshold from "../../../../../img/basic_threshold.png";



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
              maxW={{ base: '100%', sm: '200px' }}
              src={basic_threshold}
              alt='Caffe Latte'
            />

            <Stack>
              <CardBody>
                <Heading size='md'>Basic Threshold</Heading>

                <Text py='2'>
                  With one threshold, you can detect <u>one</u> of the following situtation :
                  <UnorderedList>
                    <ListItem>When the PRIMARY sensor go above or below a given value</ListItem>
                    <ListItem>When the SECONDARY sensor go above or below a given value </ListItem>
                    <ListItem>When the delta (two consecutive measure) of the PRIMARY sensor go above or below a given value</ListItem>
                    <ListItem>When the delta (two consecutive measure) of the SECONDARY sensor go above or below a given value</ListItem>
                  </UnorderedList>
                  If you want to simultaneously detect the 4 situations above, please configure 4 threshold (= 4 frames).
                </Text>
              </CardBody>


            </Stack>
          </Card>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
