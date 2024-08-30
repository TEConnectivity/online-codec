import { Text } from "@chakra-ui/react";
import { BatteryType, CharacTypeCommon } from "@te-connectivity/iot-codec";
import { useEffect } from "react";

interface ChildrenProps {
  onInputChange: (data: BatteryType) => void;
}


export default function App({ onInputChange }: ChildrenProps) {



  useEffect(() => {
    // Modifier la valeur de data32 dès le premier rendu
    onInputChange({ type: CharacTypeCommon.BATTERY, reset: true })

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
