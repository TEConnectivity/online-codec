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
import BLE from "./components/BLE/BLE"
import BLE_MP from "./components/BLE/BLE_MP"
import DFUlib from "./components/BLE/DFU/DFUlib"
import Characteristics from "./components/Characteristics"
import Decoder from "./components/Decoder"
import Download from "./components/Download"
import Encoder from "./components/Encoder"
import Footer from "./components/Footer"
import NavBar from "./components/NavBar"
import Products from "./components/Products"
import FactorySwitcher from "./components/BLE/FactoryMode/FactorySwitcher"
import RegionSwitcher from "./components/BLE/FactoryMode/RegionSwitcher"




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
          <Route path="/ble-tool-mp" element={<BLE_MP />} />
          <Route path="/ble-tool" element={<BLE />} />
          <Route path="/ble-tool/dfu" element={<DFUlib />} />
          <Route path="/ble-tool/region-change" element={<FactorySwitcher />} />

          {/* This one is only used for debug purpose if a sensor is suspected to be already be in factory mode */}
          <Route path="/ble-tool/region-change/factory" element={<RegionSwitcher />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  </ChakraProvider>
)
