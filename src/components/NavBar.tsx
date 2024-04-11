
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Tooltip,
  VStack,
  chakra,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";

import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function App() {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();

  return (

    <chakra.header
      bg={bg}
      w="full"
      px={{ base: 2, sm: 4 }}
      py={4}
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <Flex>
          <HStack>
            <ChakraLink as={ReactRouterLink} to='/'>
              <AiFillHome size="30px" />
            </ChakraLink>

            <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
              Online CoDec
            </chakra.h1>
          </HStack>
        </Flex>



        <HStack display="flex" alignItems="center" spacing={1}>

          {/* For Desktop view */}
          <HStack
            spacing={1}
            mr={1}
            color="brand.500"
            display={{ base: "none", md: "inline-flex" }}
          >

            <Tooltip label='Generate downlink frames'>
              <ChakraLink as={ReactRouterLink} to='/encoder'>
                <Button w="full" variant="ghost">
                  Encoder
                </Button>
              </ChakraLink>
            </Tooltip>

            <Tooltip label='For uplink frames'>
              <ChakraLink as={ReactRouterLink} to='/decoder'>
                <Button w="full" variant="ghost">
                  Decoder
                </Button>
              </ChakraLink>
            </Tooltip>

            <Tooltip label='Which sensors are supported ?'>
              <ChakraLink as={ReactRouterLink} to='/products'>
                <Button w="full" variant="ghost">
                  Supported products
                </Button>
              </ChakraLink>
            </Tooltip>

            <Tooltip label='Full list of available characteristics'>
              <ChakraLink as={ReactRouterLink} to='/characteristics'>
                <Button w="full" variant="ghost">
                  Characteristics
                </Button>
              </ChakraLink>
            </Tooltip>

            <Tooltip label='Integrate the lib with your own system!'>
              <ChakraLink as={ReactRouterLink} to='/download'>
                <Button w="full" variant="ghost">
                  Download
                </Button>
              </ChakraLink>
            </Tooltip>

          </HStack>

          {/* For mobile view, hide above md size screen */}
          <Box display={{ base: "flex", md: "none" }}>


            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              fontSize="20px"
              color="gray.800"
              _dark={{ color: "inherit" }}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />


            <Drawer
              isOpen={mobileNav.isOpen}
              placement='right'
              onClose={mobileNav.onClose}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <Center><DrawerHeader>Menu</DrawerHeader></Center>

                <VStack>
                  <ChakraLink as={ReactRouterLink} to='/encoder'>
                    <Button onClick={mobileNav.onClose} w="full" variant="ghost">
                      Encoder
                    </Button>
                  </ChakraLink>

                  <ChakraLink as={ReactRouterLink} to='/decoder'>
                    <Button onClick={mobileNav.onClose} w="full" variant="ghost">
                      Decoder
                    </Button>
                  </ChakraLink>

                  <ChakraLink as={ReactRouterLink} to='/products'>
                    <Button w="full" variant="ghost">
                      Supported products
                    </Button>
                  </ChakraLink>

                  <ChakraLink as={ReactRouterLink} to='/characteristics'>
                    <Button w="full" variant="ghost">
                      Characteristics
                    </Button>
                  </ChakraLink>

                  <ChakraLink as={ReactRouterLink} to='/download'>
                    <Button w="full" variant="ghost">
                      Download
                    </Button>
                  </ChakraLink>

                </VStack>
              </DrawerContent>
            </Drawer>


          </Box>




        </HStack>
      </Flex>
    </chakra.header>

  );
};
