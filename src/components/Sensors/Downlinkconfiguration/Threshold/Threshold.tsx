import { Select, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ThresholdType } from "../../../../shared/Schemas";
import THSComm from "./THSComm";
import THSConfig from "./THSConfig";
import THSLevel from "./THSLevel";
import THSMeasurementInterval from "./THSMeasurementInterval";
import ThresholdPopOverComplex from "./ThresholdPopOverComplex";
import ThresholdPopOverGuide from "./ThresholdPopOverGuide";
import ThresholdPopOverSimple from "./ThresholdPopOverSimple";


interface ChildrenProps {
  onInputChange: (data: ThresholdType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {


  const [thresholdConfig, setThresholdConfig] = useState<ThresholdType>({
    id_data: '', // 1 Byte
    param_sel: '', // 1 Byte
    data32: '', // 4 Bytes
  });

  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handleID_Data(id_data: string) {
    var newState = { id_data: id_data, param_sel: "", data32: "00000000" }
    setThresholdConfig(newState)
    onInputChange(newState)

  }

  // Callback function, when the user edit the form, the payload is automatically regenerated
  function handlePARAM_SEL(param_sel: string) {
    var newState = { id_data: thresholdConfig.id_data, param_sel: param_sel, data32: "00000000" }
    setThresholdConfig(newState)
    onInputChange(newState)
  }


  return (
    <VStack width={"100%"} >

      <Text>For a given data, configure <ThresholdPopOverSimple>one threshold</ThresholdPopOverSimple> if you want a simple alarm. Configure <ThresholdPopOverComplex>two threshold</ThresholdPopOverComplex> if you want out-of-range or successive detection.</Text>
      <Text><ThresholdPopOverGuide>Need Help ?</ThresholdPopOverGuide></Text>
      <Select value={thresholdConfig.id_data} onChange={(ev) => handleID_Data(ev.target.value)} placeholder='Threshold...'>
        <optgroup label="Threshold 1">
          <option value='00'>Main Sensor simple data</option>
          <option value='01'>Main Sensor delta data</option>
          <option value='02'>Secondary Sensor simple data</option>
          <option value='03'>Secondary Sensor delta data</option>
        </optgroup>
        <optgroup label="Threshold 2">
          <option value='04'>Main Sensor simple data</option>
          <option value='05'>Main Sensor delta data</option>
          <option value='06'>Secondary Sensor simple data</option>
          <option value='07'>Secondary Sensor delta data</option>
        </optgroup>
      </Select>


      {/* Param SEL */}
      {(thresholdConfig.id_data !== "") &&
        <>
          <Text>Select the desired operation on this threshold : </Text>
          <Select value={thresholdConfig.param_sel} onChange={(ev) => handlePARAM_SEL(ev.target.value)} placeholder='Operation...'>
            <optgroup label="Threshold configuration">
              <option value='00'>Change inner threshold configuration</option>
              <option value='01'>Change level (simple or delta)</option>
            </optgroup>
            <optgroup label="Target state once the threshold is reached">
              <option value='02'>Change measurement interval</option>
              <option value='03'>Change communication mode (BLE, LoRa...)</option>
            </optgroup>
          </Select>
        </>
      }

      {/* DATA32 */}
      {(thresholdConfig.param_sel !== "") &&
        <>

          {/* If configuration is selected*/}
          {(thresholdConfig.param_sel === "00") && <THSConfig onInputChange={onInputChange} setThresholdConfig={setThresholdConfig} thresholdConfig={thresholdConfig} />}

          {/* If level is selected*/}
          {(thresholdConfig.param_sel === "01") && <THSLevel onInputChange={onInputChange} setThresholdConfig={setThresholdConfig} thresholdConfig={thresholdConfig} />}

          {/* If measurement interval is selected*/}
          {(thresholdConfig.param_sel === "02") && <THSMeasurementInterval onInputChange={onInputChange} setThresholdConfig={setThresholdConfig} thresholdConfig={thresholdConfig} />}

          {/* If communication mode is selected*/}
          {(thresholdConfig.param_sel === "03") && <THSComm onInputChange={onInputChange} setThresholdConfig={setThresholdConfig} thresholdConfig={thresholdConfig} />}

        </>
      }


    </VStack>
  );
};
