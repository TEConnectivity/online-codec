import {
  ChakraProvider,
  Container,
  theme
} from "@chakra-ui/react"
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom"
import Characteristics from "./components/Characteristics"
import Decoder from "./components/Decoder"
import Download from "./components/Download"
import Encoder from "./components/Encoder"
import Footer from "./components/Footer"
import NavBar from "./components/NavBar"
import Products from "./components/Products"




export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter basename={"/online-codec"}>
      <NavBar />
      <Container minHeight="100%" maxW="100%" pb="500px">
        <Routes>
          <Route path="" element={<Decoder />} />
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
