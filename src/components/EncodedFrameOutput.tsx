import { Input, Text, VStack } from "@chakra-ui/react";
import { Characteristic, CharacTypeMP, encode, encode_multi_frame, Frame, MultiFramePayload, Operation, SensorFamily, UserPayloadType } from "@te-connectivity/iot-codec";
import { useEffect, useState } from "react";

interface Props {
  charac: Characteristic,
  operation: Operation,
  family: SensorFamily,
  payload: UserPayloadType | MultiFramePayload
}

/**
 * Component which renders the output encoded frame, in HEX & Base64 format.
 */
export default function App(props: Props) {
  const [decodingError, setDecodingError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [multiFrameResult, setMultiFrameResult] = useState<Frame[] | null>(null);



  useEffect(() => {
    try {
      if (props.payload.type === CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI) {
        const array_encoded = encode_multi_frame(props.charac, props.operation, props.payload,);
        setMultiFrameResult(array_encoded);
      }
      else {
        const encodedFrame = encode(props.charac, props.operation, props.payload);
        setMultiFrameResult([encodedFrame]);
      }
      setDecodingError(false);
    } catch (exception: any) {
      setErrorMsg(exception.message || 'An unknown error occurred');
      setDecodingError(true);
    }
  }, [props.charac, props.operation, props.payload, props.family]);

  return (
    <>
      {decodingError ? (
        <Text>Error during encoding: {errorMsg}</Text>
      ) : (
        <VStack width="100%" my="1rem" justifyContent="flex-start">
          <Text>Send the following frame in this order:</Text>
          {multiFrameResult?.map((frame, index) =>
            <Input key={index} isReadOnly value={frame.toHexString() || ''}></Input>
          )}
          <Text>Base64:</Text>
          {multiFrameResult?.map((frame, index) =>
            <Input key={index} isReadOnly value={frame.toBase64() || ''}></Input>
          )}
          <Text>LoRa fPort :</Text>
          <Input isReadOnly value={multiFrameResult?.at(0)?.fport}></Input>
        </VStack >
      )
      }
    </>
  );
}