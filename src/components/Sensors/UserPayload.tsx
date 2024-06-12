import { Text } from "@chakra-ui/react";
import { CharacType, Characteristic, Operation, SensorFamily, UserPayloadType, encode } from "@te-connectivity/iot-codec";
import { useState } from "react";
import EncodedFrameOutput from "../EncodedFrameOutput";
import BLEActivation from "./Downlinkconfiguration/Common/BLEActivation";
import Battery from "./Downlinkconfiguration/Common/Battery";
import Keepalive from "./Downlinkconfiguration/Common/Keepalive";
import LoRaConfirmation from "./Downlinkconfiguration/Common/LoRaConfirmation";
import LoRaMode from "./Downlinkconfiguration/Common/LoRaMode";
import MeasurementInterval from "./Downlinkconfiguration/Common/MeasurementInterval";
import DatalogAnalysis from "./Downlinkconfiguration/SinglePoint/Threshold/DatalogAnalysis";
import DatalogData from "./Downlinkconfiguration/SinglePoint/Threshold/DatalogData";
import Threshold from "./Downlinkconfiguration/SinglePoint/Threshold/Threshold";



interface Props {
  charac: Characteristic,
  operation: Operation,
  family: SensorFamily
}


/**
 * Manage the user input to configure all the different characteristics.
 * 
 * Produce <input> block depending on the type of charac (threshold, measurement interval, etc...)
 */
export default function App(props: Props) {

  const [userPayload, setUserPayload] = useState<UserPayloadType>({} as UserPayloadType)

  // Function to receive data from children component
  const handleInputChange = (data: any) => {

    setUserPayload({ ...data, type: props.charac.type });

  };


  var returnComponent = null;
  // Output is completlty different, depending on type of charac : 
  switch (props.charac.type) {
    // Measurement interval, hour & minute & seconds
    case (CharacType.MEAS_INTERVAL):
      returnComponent = <MeasurementInterval onInputChange={handleInputChange} />
      break;
    case (CharacType.THRESHOLD):
      returnComponent = <Threshold onInputChange={handleInputChange} />
      break;
    case (CharacType.BLE_ACTIVATION):
      returnComponent = <BLEActivation onInputChange={handleInputChange} />
      break;
    case (CharacType.BATTERY):
      returnComponent = <Battery onInputChange={handleInputChange} />
      break;
    case (CharacType.KEEPALIVE):
      returnComponent = <Keepalive onInputChange={handleInputChange} />
      break;
    case (CharacType.DATALOG_DATA):
      returnComponent = <DatalogData onInputChange={handleInputChange} />
      break;
    case (CharacType.DATALOG_ANALYSIS):
      returnComponent = <DatalogAnalysis onInputChange={handleInputChange} />
      break;
    case (CharacType.LORA_MODE):
      returnComponent = <LoRaMode onInputChange={handleInputChange} />
      break;
    case (CharacType.LORA_PERCENTAGE):
      returnComponent = <LoRaConfirmation onInputChange={handleInputChange} />
      break;
    default:
      returnComponent = <Text>Sorry the configuration of this characheristic is not yet supported</Text>
  }


  return (
    <>
      <Text align={"center"} mb="10px">Configuration</Text>

      {/* The configuration component allowing the user to tune the parameter related to this specific charac */}
      {returnComponent}

      {/* The output component showing the b64 frame */}
      {isConfReady(userPayload) && <EncodedFrameOutput frame={encode(props.charac, props.operation, userPayload, props.family).toHexString()}></EncodedFrameOutput>}


    </>
  );
};



function isConfReady(input: Object): boolean {

  // On verifie que l'objet n'est pas vide {}
  if (Object.keys(input).length <= 0)
    return false

  // Pour chaque pair de key/value contenu dans l'objet on verifie que la clée est valide et que la valeur de la clée n'est pas une chaine vide
  return Object.entries(input).every(([key, value]) =>
    typeof key === 'string' && key !== '' && typeof value !== 'undefined' && value !== ""
  );
}