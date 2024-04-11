import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { encode } from "../../shared/EncoderLib";
import { CharacType, Characteristic } from "../../shared/Schemas";
import EncodedFrameOutput from "../EncodedFrameOutput";
import MeasurementInterval from "./Downlinkconfiguration/MeasurementInterval";
import Threshold from "./Downlinkconfiguration/Threshold";



interface Props {
  charac: Characteristic,
  operation: string
}



/**
 * Manage the user input to configure all the different characteristics.
 * 
 * Produce <input> block depending on the type of charac (threshold, measurement interval, etc...)
 */
export default function App(props: Props) {

  const [userPayload, setUserPayload] = useState({})
  console.log(userPayload)

  // Function to receive data from children component
  const handleInputChange = (data: any) => {
    setUserPayload(data);
  };

  var returnComponent = null;
  // Output is completlty different, depending on type of charac : 
  switch (props.charac.type) {

    // Measurement interval, hour & minute & seconds
    case (CharacType.MEAS_INTERVAL):
      returnComponent = <MeasurementInterval onInputChange={handleInputChange} />
      break;
    case (CharacType.THREHSOLD):
      returnComponent = <Threshold onInputChange={handleInputChange} />
      break;
    default:
      returnComponent = <Text>Sorry the configuration of this characheristic is not yet supported</Text>
  }


  return (
    <Box>
      <Text align={"center"} mb="10px">Configuration : </Text>

      {/* The configuration component allowing the user to tune the parameter related to this specific charac */}
      {returnComponent}

      {/* The output component showing the b64 frame */}
      {(Object.keys(userPayload).length !== 0) && <EncodedFrameOutput frame={encode(props.charac, props.operation, userPayload)}></EncodedFrameOutput>}


    </Box>
  );
};
