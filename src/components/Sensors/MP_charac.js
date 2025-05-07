import { CharacTypeMP } from "@te-connectivity/iot-codec";

export const MP_Charac = [
    {
        "uuid": "2A00",
        "charac_name": "Device Name",
        "payload_size": "9",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "2A01",
        "charac_name": "Appearance",
        "payload_size": "2",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "2A04",
        "charac_name": "Peripheral Preferred Connection Parameters",
        "payload_size": "8",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "2AA6",
        "charac_name": "Central Address Resolution",
        "payload_size": "1",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "2A05",
        "charac_name": "Service Change",
        "payload_size": "0",
        "ble": "i",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "2A24",
        "charac_name": "Model Number",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "2A25",
        "charac_name": "Serial Number",
        "payload_size": "12",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "2A26",
        "charac_name": "Firmware revision",
        "payload_size": "40",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "2A27",
        "charac_name": "Hardware revision",
        "payload_size": "7",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "2A29",
        "charac_name": "Manufacturer",
        "payload_size": "9",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "CF01",
        "charac_name": "Sensor Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "CF02",
        "charac_name": "Communication Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "CF03",
        "charac_name": "Battery Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "FC01",
        "charac_name": "Device status",
        "payload_size": "1",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "2A19",
        "charac_name": "Battery level",
        "payload_size": "1",
        "ble": "r|w|n",
        "lora": "r|w|wr",
        "type": "battery"
    },
    {
        "uuid": "CD01",
        "charac_name": "Customer Specific Data",
        "payload_size": "4",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "CD02",
        "charac_name": "BLE Adv Mode Configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "CD04",
        "charac_name": "BLE ADV interval",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "CD03",
        "charac_name": "Change Device Name",
        "payload_size": "25",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "CD05",
        "charac_name": "BLE Activation over LoRa",
        "payload_size": "1",
        "ble": "",
        "lora": "r|w|wr",
        "type": "ble_activation"
    },
    {
        "uuid": "2A6E",
        "charac_name": "Internal platform temperature",
        "payload_size": "2",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "CE01",
        "charac_name": "LoRa Keep Alive",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": "keepalive"
    },
    {
        "uuid": "CE02",
        "charac_name": "BLE Keep Alive",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "B301",
        "charac_name": "Measurement Counter",
        "payload_size": "2",
        "ble": "r|w|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "B302",
        "charac_name": "Measurement interval",
        "payload_size": "3",
        "ble": "r",
        "lora": "r",
        "type": "meas_interval"
    },
    {
        "uuid": "DA01",
        "charac_name": "Last data acquired",
        "payload_size": "6",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "DA03",
        "charac_name": "Raw Time data",
        "payload_size": "4",
        "ble": "r",
        "lora": "wr",
        "type": "raw_time_data"
    },
    {
        "uuid": "B402",
        "charac_name": "Live mode configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "F810",
        "charac_name": "LoRaWAN Mode Configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": "lora_mode"
    },
    {
        "uuid": "F801",
        "charac_name": "DevEUI",
        "payload_size": "8",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "F802",
        "charac_name": "AppEUI",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "F803",
        "charac_name": "Region",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "F804",
        "charac_name": "NetID",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "F805",
        "charac_name": "LoRaWAN Status",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "F806",
        "charac_name": "Percentage of confirmed uplink",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": "lora_percentage"
    },
    {
        "uuid": "EE00",
        "charac_name": "Factory Mode activation",
        "payload_size": "0",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "F806",
        "charac_name": "OTA process",
        "payload_size": "0",
        "ble": "w",
        "lora": "",
        "type": ""
    },
    {
        uuid: "FA01",
        charac_name: "Axis selection",
        payload_size: "1",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.AXIS_SELECTION
    },
    {
        uuid: "FA02",
        charac_name: "Preset selection",
        payload_size: "2",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.PRESET_SELECTION
    },
    {
        uuid: "FA03",
        charac_name: "Windowing function",
        payload_size: "1",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.WINDOWING_FUNCTION
    },
    {
        uuid: "FA10",
        charac_name: "Preset configuration",
        payload_size: "6",
        ble: "r|w",
        lora: "w|wr",
        type: CharacTypeMP.PRESET_CONFIGURATION
    },
    {
        uuid: "FA10",
        charac_name: "Preset request configuration",
        payload_size: "1",
        ble: "r|w",
        lora: "wr",
        type: CharacTypeMP.PRESET_REQUEST
    },
    {
        uuid: "FA11",
        charac_name: "Window Configuration",
        payload_size: "8",
        ble: "r|w",
        lora: "w|wr",
        type: CharacTypeMP.WINDOW_CONFIGURATION
    },
    {
        uuid: "FA11",
        charac_name: "Window Request",
        payload_size: "2",
        ble: "r|w",
        lora: "wr",
        type: CharacTypeMP.WINDOW_REQUEST
    },
    {
        uuid: "B201",
        charac_name: "Multipoint Threshold Request",
        payload_size: "2",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeMP.MULTIPOINT_THRESHOLD_REQUEST
    },
    {
        uuid: "B201",
        charac_name: "Multipoint Threshold",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI
    },
]