import { Text } from "@chakra-ui/react";
import { V3_5 } from "@te-connectivity/iot-codec";
import { useEffect } from "react";

interface ChildrenProps {
  onInputChange: (data: V3_5.BatteryType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {



  useEffect(() => {
    // Modifier la valeur de data32 dès le premier rendu
    onInputChange({ type: V3_5.CharacTypeCommon_3_5_0.BATTERY, reset: true })

    // eslint-disable-next-line
  }, []); // le tableau de dépendances est vide, donc cette fonction s'exécutera uniquement après le premier rendu





  return (
    <>
      <Text>
        Writing to this characheristic allows you to reset the battery algorithm. It is mandatory to do so each time you replace the battery.
      </Text>

    </>
  );
};
