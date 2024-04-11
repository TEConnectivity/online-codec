export const SP_Charac = [
    {
        "uuid": "0x2A00",
        "charac_name": "Device Name",
        "payload_size": "9",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0x2A01",
        "charac_name": "Appearance",
        "payload_size": "2",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0x2A04",
        "charac_name": "Peripheral Preferred Connection Parameters",
        "payload_size": "8",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0x2AA6",
        "charac_name": "Central Address Resolution",
        "payload_size": "1",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0x2A05",
        "charac_name": "Service Change",
        "payload_size": "0",
        "ble": "i",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0x2A24",
        "charac_name": "Model Number",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0x2A25",
        "charac_name": "Serial Number",
        "payload_size": "12",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0x2A26",
        "charac_name": "Firmware revision",
        "payload_size": "40",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0x2A27",
        "charac_name": "Hardware revision",
        "payload_size": "7",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0x2A29",
        "charac_name": "Manufacturer",
        "payload_size": "9",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xCF01",
        "charac_name": "Sensor Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xCF02",
        "charac_name": "Communication Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xCF03",
        "charac_name": "Battery Diagnosis",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xFC01",
        "charac_name": "Device status",
        "payload_size": "1",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0x2A19",
        "charac_name": "Battery level",
        "payload_size": "1",
        "ble": "r|w|n",
        "lora": "r|w|wr",
        "type": ""
    },
    {
        "uuid": "0xCD01",
        "charac_name": "Customer Specific Data",
        "payload_size": "4",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xCD02",
        "charac_name": "BLE Adv Mode Configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xCD04",
        "charac_name": "BLE ADV interval",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xCD03",
        "charac_name": "Change Device Name",
        "payload_size": "25",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xCD05",
        "charac_name": "BLE Activation over LoRa",
        "payload_size": "1",
        "ble": "",
        "lora": "r|w|wr",
        "type": ""
    },
    {
        "uuid": "0x2A6E",
        "charac_name": "Internal platform temperature",
        "payload_size": "2",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xCE01",
        "charac_name": "LoRa Keep Alive",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": ""
    },
    {
        "uuid": "0xCE02",
        "charac_name": "BLE Keep Alive",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xB301",
        "charac_name": "Measurement Counter",
        "payload_size": "2",
        "ble": "r|w|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xB302",
        "charac_name": "Measurement interval",
        "payload_size": "3",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": "meas_interval"
    },
    {
        "uuid": "0xDA01",
        "charac_name": "Last data acquired",
        "payload_size": "6",
        "ble": "r|n",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xB401",
        "charac_name": "Live Measurement interval",
        "payload_size": "1",
        "ble": "r",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xB402",
        "charac_name": "Live mode configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xB201",
        "charac_name": "Threshold",
        "payload_size": "6",
        "ble": "r|w|n",
        "lora": "w|wr",
        "type": "threshold"
    },
    {
        "uuid": "0xDB01",
        "charac_name": "Datalog data",
        "payload_size": "0",
        "ble": "r|w|n",
        "lora": "wr",
        "type": ""
    },
    {
        "uuid": "0xDB02",
        "charac_name": "Datalog analysis request",
        "payload_size": "27",
        "ble": "r|w|n",
        "lora": "wr",
        "type": ""
    },
    {
        "uuid": "0xF810",
        "charac_name": "LoRaWAN Mode Configuration",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|wr",
        "type": ""
    },
    {
        "uuid": "0xF801",
        "charac_name": "DevEUI",
        "payload_size": "8",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xF802",
        "charac_name": "AppEUI",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xF803",
        "charac_name": "Region",
        "payload_size": "1",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xF804",
        "charac_name": "NetID",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xF805",
        "charac_name": "LoRaWAN Status",
        "payload_size": "4",
        "ble": "r",
        "lora": "r",
        "type": ""
    },
    {
        "uuid": "0xF806",
        "charac_name": "Percentage of confirmed uplink",
        "payload_size": "1",
        "ble": "r|w",
        "lora": "r|w|n",
        "type": ""
    },
    {
        "uuid": "0xEE00",
        "charac_name": "Factory Mode activation",
        "payload_size": "0",
        "ble": "r|w",
        "lora": "",
        "type": ""
    },
    {
        "uuid": "0xF806",
        "charac_name": "OTA process",
        "payload_size": "0",
        "ble": "w",
        "lora": "",
        "type": ""
    }
]