import { displayUint8ArrayAsHex } from "./Helper";
import { Characteristic, CharacType } from "./Schemas";


/** Découpe un string "0A0A0A" en tableau de byte [0x0A,0x0A,0x0A]
 */
function toByteArray(byte_string: string, size: number) {
  const byteArray = byte_string.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || [];



  if (size > byteArray.length) {
    const paddingSize = size - byteArray.length;
    for (let i = 0; i < paddingSize; i++) {
      byteArray.unshift(0);
    }
  }


  return byteArray;
}



export function encode(charac: Characteristic, operationChosen: string, user_payload: any) {


  var payload_header = new Uint8Array(3);

  // Operation code
  switch (operationChosen) {
    case "w":
      payload_header[0] = 0x01;
      break;
    case "wr":
      payload_header[0] = 0x02
      break;
    default:
      payload_header[0] = 0x00
  }

  // UUID
  var uuid = parseInt(charac.uuid, 16)
  payload_header[1] = (uuid >> 8) & 0xFF; // 1st byte
  payload_header[2] = uuid & 0xFF;  // 2nd byte



  var payload = new Uint8Array(0)

  // Creation of user payload if needed
  if (operationChosen === "w" || operationChosen === "wr") {
    payload = payloadFormatter(charac, user_payload)
  }


  // Concatenation of both array
  let frame = new Uint8Array(payload_header.length + payload.length);
  frame.set(payload_header, 0)
  frame.set(payload, payload_header.length)

  return displayUint8ArrayAsHex(frame)
}






function payloadFormatter(charac: Characteristic, user_payload: any) {

  var encoded_input = new Uint8Array(parseInt(charac.payload_size, 10))

  switch (charac.type) {
    case (CharacType.MEAS_INTERVAL):
      encoded_input[0] = parseInt(user_payload.hour, 10) //Hour
      encoded_input[1] = parseInt(user_payload.minute, 10) //Minute
      encoded_input[2] = parseInt(user_payload.second, 10) //Second
      break;
    case (CharacType.THREHSOLD):
      encoded_input[0] = parseInt(user_payload.id_data, 16)
      encoded_input[1] = parseInt(user_payload.param_sel, 16)
      const bytesArray: number[] = toByteArray(user_payload.data32, 4)
      encoded_input.set(bytesArray, 2)
      break;
  }

  return encoded_input

}