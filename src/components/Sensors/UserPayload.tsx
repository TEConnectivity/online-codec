import { Text } from "@chakra-ui/react";
import { CharacTypeCommon, CharacTypeMP, CharacTypeSP, Characteristic, MultiFramePayload, Operation, SensorFamily, UserPayloadType } from "@te-connectivity/iot-codec";
import { useState } from "react";
import EncodedFrameOutput from "../EncodedFrameOutput";
import BLEActivation from "./Downlinkconfiguration/Common/BLEActivation";
import Battery from "./Downlinkconfiguration/Common/Battery";
import Keepalive from "./Downlinkconfiguration/Common/Keepalive";
import LoRaConfirmation from "./Downlinkconfiguration/Common/LoRaConfirmation";
import LoRaMode from "./Downlinkconfiguration/Common/LoRaMode";
import MeasurementInterval from "./Downlinkconfiguration/Common/MeasurementInterval";
import AxisSelection from "./Downlinkconfiguration/Multpoint/AxisSelection";
import MultipointThreshold from "./Downlinkconfiguration/Multpoint/MultipointThreshold";
import PresetConfiguration from "./Downlinkconfiguration/Multpoint/PresetConfiguration";
import PresetRequest from "./Downlinkconfiguration/Multpoint/PresetRequest";
import PresetSelection from "./Downlinkconfiguration/Multpoint/PresetSelection";
import WindowConfiguration from "./Downlinkconfiguration/Multpoint/WindowConfiguration";
import WindowRequest from "./Downlinkconfiguration/Multpoint/WindowRequest";
import WindowingFunction from "./Downlinkconfiguration/Multpoint/WindowingFunction";
import DatalogAnalysis from "./Downlinkconfiguration/SinglePoint/Threshold/DatalogAnalysis";
import DatalogData from "./Downlinkconfiguration/SinglePoint/Threshold/DatalogData";
import Threshold from "./Downlinkconfiguration/SinglePoint/Threshold/Threshold";
import RawTimeData from "./Downlinkconfiguration/Multpoint/RawTimeData";



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

  const [userPayload, setUserPayload] = useState<UserPayloadType | MultiFramePayload>({} as UserPayloadType)

  // Function to receive data from children component
  const handleInputChange = (data: any) => {
    console.log("Input change ", data)
    setUserPayload({ ...data, type: props.charac.type });

  };


  var returnComponent = null;
  // Output is completlty different, depending on type of charac : 
  switch (props.charac.type) {

    case (CharacTypeCommon.THRESHOLD):
      returnComponent = <Threshold onInputChange={handleInputChange} />
      break;
    case (CharacTypeCommon.BLE_ACTIVATION):
      returnComponent = <BLEActivation onInputChange={handleInputChange} />
      break;
    case (CharacTypeCommon.BATTERY):
      returnComponent = <Battery onInputChange={handleInputChange} />
      break;
    case (CharacTypeCommon.KEEPALIVE):
      returnComponent = <Keepalive onInputChange={handleInputChange} />
      break;
    case (CharacTypeCommon.LORA_MODE):
      returnComponent = <LoRaMode onInputChange={handleInputChange} />
      break;
    case (CharacTypeCommon.LORA_PERCENTAGE):
      returnComponent = <LoRaConfirmation onInputChange={handleInputChange} />
      break;

    // SINGLEPOINT
    case (CharacTypeSP.DATALOG_DATA):
      returnComponent = <DatalogData onInputChange={handleInputChange} />
      break;
    case (CharacTypeSP.DATALOG_ANALYSIS):
      returnComponent = <DatalogAnalysis onInputChange={handleInputChange} />
      break;
    case (CharacTypeSP.MEAS_INTERVAL):
      returnComponent = <MeasurementInterval onInputChange={handleInputChange} />
      break;

    // MULTIPOINT
    case (CharacTypeMP.AXIS_SELECTION):
      returnComponent = <AxisSelection onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.PRESET_SELECTION):
      returnComponent = <PresetSelection onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.WINDOWING_FUNCTION):
      returnComponent = <WindowingFunction onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.PRESET_CONFIGURATION):
      returnComponent = <PresetConfiguration onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.PRESET_REQUEST):
      returnComponent = <PresetRequest onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.WINDOW_CONFIGURATION):
      returnComponent = <WindowConfiguration onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.WINDOW_REQUEST):
      returnComponent = <WindowRequest onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI):
      returnComponent = <MultipointThreshold onInputChange={handleInputChange} />
      break;
    case (CharacTypeMP.RAW_TIME_DATA):
      returnComponent = <RawTimeData onInputChange={handleInputChange} />
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
      {isConfReady(userPayload) && <EncodedFrameOutput charac={props.charac} family={props.family} operation={props.operation} payload={userPayload}></EncodedFrameOutput>}


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

