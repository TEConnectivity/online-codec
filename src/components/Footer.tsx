'use client'

import {
  Box,
  Container,
  Text,
  useColorModeValue
} from '@chakra-ui/react'



export default function SmallWithLogoLeft() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      as='footer'
      position="relative"
      bottom="0px"
      left="0px"
      right="0px"
      p="35px"
    >
      <Container>
        <Text>This website is a demo, suited for illustrative purpose only, not suited for production (MIT License). The result are shown without any warranty.</Text>
      </Container>
    </Box>
  )
}