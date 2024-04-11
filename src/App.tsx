import * as React from "react"
import {
  ChakraProvider,
  Container,
  Box,
  theme,
  Flex,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import NavBar from "./components/NavBar"
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Decoder from "./components/Decoder"
import Encoder from "./components/Encoder"
import Products from "./components/Products"
import Footer from "./components/Footer"
import Characteristics from "./components/Characteristics"
import Download from "./components/Download"




export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <NavBar />
      <Container minHeight="100%" maxW="100%" pb="500px">
        <Routes>
          <Route path="/" element={<Decoder />} />
          <Route path="/encoder" element={<Encoder />} />
          <Route path="/decoder" element={<Decoder />} />
          <Route path="/products" element={<Products />} />
          <Route path="/characteristics" element={<Characteristics />} />
          <Route path="/download" element={<Download />} />

        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  </ChakraProvider>
)
