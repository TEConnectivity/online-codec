'use client'

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react'
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { ReactNode } from 'react'



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
        LOGO??

        <Text>Not all related to TE. Illustrative purpose only</Text>
      </Container>
    </Box>
  )
}