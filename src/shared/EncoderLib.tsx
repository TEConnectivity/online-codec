import { displayUint8ArrayAsHex, insertValueInByte, numberToByteArray } from "./Helper";
import { CharacType, Characteristic } from "./Schemas";


/** Découpe un string "A0A0A" en tableau de byte [0x0A,0x0A,0x0A]
 */
function toByteArray(byte_string: string, size: number) {
  // Assurer que la longueur de la chaîne hexadécimale est un multiple de 2
  byte_string = byte_string.padStart(size * 2, '0');

  // Convertir chaque paire de caractères hexadécimaux en un octet
  let byteArray = [];
  for (let i = 0; i < byte_string.length; i += 2) {
    byteArray.unshift(parseInt(byte_string.substring(i, i + 2), 16));
  }

  // Remplir le tableau avec des zéros s'il est inférieur à la taille spécifiée
  while (byteArray.length < size) {
    byteArray.push(0);
  }

  return byteArray.reverse();
}


/** High Level function allowing other programmer to interface with the encoding library.
 * 
 * Take full json object as input 
 * 
 */
function directEncode() {

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

  let bytesArray: number[];

  switch (charac.type) {
    case (CharacType.MEAS_INTERVAL):
      encoded_input[0] = parseInt(user_payload.hour, 10) //Hour
      encoded_input[1] = parseInt(user_payload.minute, 10) //Minute
      encoded_input[2] = parseInt(user_payload.second, 10) //Second
      break;
    case (CharacType.THREHSOLD):
      encoded_input[0] = parseInt(user_payload.id_data, 16)
      encoded_input[1] = parseInt(user_payload.param_sel, 16)
      bytesArray = toByteArray(user_payload.data32, 4)
      console.log(bytesArray)
      encoded_input.set(bytesArray, 2)
      break;
    case (CharacType.BLE_ACTIVATION):
      encoded_input[0] = user_payload.checked ? 1 : 0;
      break;
    case (CharacType.BATTERY):
      encoded_input[0] = user_payload.reset ? 0xFF : 0;
      break;
    case (CharacType.KEEPALIVE):
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveInterval), 0)
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveMode), 3)
      break;
    case (CharacType.DATALOG_DATA):
      encoded_input[0] = user_payload.type
      console.log(user_payload.index)
      encoded_input.set(numberToByteArray(user_payload.index), 1)
      encoded_input[3] = user_payload.length
      break;
    case (CharacType.DATALOG_ANALYSIS):
      encoded_input[0] = 0x02
      encoded_input.set(numberToByteArray(user_payload.length), 1)
      break;
    case (CharacType.LORA_MODE):
      encoded_input[0] = user_payload.type
      break;
    case (CharacType.LORA_PERCENTAGE):
      encoded_input[0] = user_payload.percentage
      break;
  }

  return encoded_input

}