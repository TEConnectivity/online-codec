import { Characteristic, CharacType } from "./Schemas";

// Pretty print uint8array to hex
function toHex(byte: number) {
  return ('0' + byte.toString(16).toUpperCase()).slice(-2);
}

// Fonction pour afficher un Uint8Array en hexadécimal dans une div
function displayUint8ArrayAsHex(uint8Array: Uint8Array) {
  let hexString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    hexString += toHex(uint8Array[i]);
    if (i < uint8Array.length - 1) {
      hexString += ' '; // Ajoute un espace entre chaque octet
    }
  }
  return hexString;
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
  }

  return encoded_input

}