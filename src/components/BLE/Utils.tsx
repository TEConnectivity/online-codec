

export type BLEDataType = "string" | "int32" | "int16" | "int8" | "float" | "buffer" | "null";


export const decodeDataView = (dataView: DataView, encoding: string = "ascii") => new TextDecoder(encoding).decode(dataView.buffer as ArrayBuffer);


export const readCharacteristicFromService = async <T extends BLEDataType>(
    service: BluetoothRemoteGATTService,
    characUUID: string,
    dataType: T
): Promise<T extends "string" ? string : T extends "int32" | "int16" | "int8" | "float" ? number : DataView | null> => {
    try {
        const characteristic = await service.getCharacteristic(characUUID);
        const value = await characteristic.readValue();

        if (!value) return null!;

        switch (dataType) {
            case "string":
                return decodeDataView(value) as any; // Assuming ASCII string
            case "int32":
                return value.getUint32(0, true) as any; // Example: 32-bit unsigned integer (little endian)
            case "int8":
                return value.getUint8(0) as any; // Example: 32-bit unsigned integer (little endian)
            case "float":
                return value.getFloat32(0, true) as any; // Example: 32-bit float
            case "buffer":
                return value as any; // Return raw DataView
            default:
                throw new Error("Unsupported data type");
        }
    } catch (error) {
        console.error(`Error reading characteristic ${characUUID}:`, error);
        return null!;
    }
};


// General Function to Write Characteristics
export const writeCharacteristic = async (service: BluetoothRemoteGATTService, characUUID: string, data: Uint8Array) => {
    try {
        const characteristic = await service?.getCharacteristic(characUUID);
        await characteristic?.writeValue(data);
        console.log(`Wrote ${data} to ${characUUID}`);
        return true
    } catch (error) {
        console.error(`Error writing ${characUUID}:`, error);
        return false
    }
};

export const dataViewToHex = (dataView: DataView): string => {
    let hex = "";
    for (let i = 0; i < dataView.byteLength; i++) {
        hex += dataView.getUint8(i).toString(16).padStart(2, "0").toUpperCase();
    }
    return hex;
};

