

/** Converti un float (type number) en sa representation hexa sur 32 bits
 *  Ex : 10.5 -> "41280000"
 */
export function floatToHexString(floatNumber: number) {
    // Créer un tampon pour stocker les données binaires du flottant
    const buffer = new ArrayBuffer(4);
    const intView = new Uint32Array(buffer);
    const floatView = new Float32Array(buffer);

    // Assigner la valeur du flottant
    floatView[0] = floatNumber;

    // Convertir en hexadécimal
    const hexString = intView[0].toString(16);

    // Ajouter le préfixe 0x
    return hexString;
}

/** Rajoute des 0 si necessaire pour fit dans un octet 
 * 
 *  Exemple : 
 * 
 * input= "C", size=2 -> "0C"
 * 
 *  input "ABC", size=6 -> "000ABC"
 */
export function zeroPadding(input: string, size: number) {
    if (input.length < size) {
        return "0".repeat(size - input.length) + input
    }
    else {
        return input
    }
}


// Pretty print uint8array to hex
export function toHex(byte: number) {
    return ('0' + byte.toString(16).toUpperCase()).slice(-2);
}

/** Converti un uint8array en string hexa
 *  
 * [0x0A,0x02] -> "0A02"
 * @param uint8Array 
 * @returns string
 */
export function displayUint8ArrayAsHex(uint8Array: Uint8Array, space = " ") {
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        hexString += toHex(uint8Array[i]);
        if (i < uint8Array.length - 1) {
            hexString += space; // Ajoute un espace entre chaque octet
        }
    }
    return hexString;
}