

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


/** For a given byte, insert a value at the offset
 *  
 * Par exemple inserer a=3 dans un octet 0x00 a l'offset 1 donnerait :
 * 0b00000110
 * Puisque 3 est "11 "en binaire
 * 
 * @param byte 
 * @param value 
 * @param offset 
 * @returns 
 */
export function insertValueInByte(byte: number, value: number, offset: number) {
    // Assurez-vous que le byte est un entier compris entre 0 et 255
    if (byte < 0 || byte > 255) {
        throw new Error("Le byte doit être un entier compris entre 0 et 255");
    }

    // Assurez-vous que la valeur est un entier compris entre 0 et 255
    if (value < 0 || value > 255) {
        throw new Error("La valeur doit être un entier compris entre 0 et 255");
    }

    // Assurez-vous que l'offset est un entier compris entre 0 et 7
    if (offset < 0 || offset > 7) {
        throw new Error("L'offset doit être un entier compris entre 0 et 7");
    }

    // Créez un masque avec un seul bit à l'offset spécifié
    let mask = 1 << offset;

    // Effacez le bit à l'offset spécifié dans le byte
    byte &= ~mask;

    // Insérer la valeur dans le byte en utilisant l'opérateur OU bit à bit
    byte |= (value << offset);

    return byte;
}



export function numberToByteArray(number: any) {
    // Déterminer le nombre de bytes nécessaires
    const byteCount = Math.ceil(Math.log2(number + 1) / 8);

    // Créer un tableau pour stocker les bytes
    const byteArray = [];

    // Extraire chaque byte
    for (let i = 0; i < byteCount; i++) {
        const byte = (number >> (8 * (byteCount - i - 1))) & 0xFF;
        byteArray.push(byte);
    }

    return byteArray;
}