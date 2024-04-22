
export interface Characteristic {
  uuid: string,
  charac_name: string,
  payload_size: string,
  ble: string,
  lora: string,
  type: CharacType
}


export enum CharacType {
  MEAS_INTERVAL = "meas_interval",
  THREHSOLD = "threshold",
  BLE_ACTIVATION = "ble_activation",
  BATTERY = "battery",
  KEEPALIVE = "keepalive",
  DATALOG_DATA = "datalog_data",
  DATALOG_ANALYSIS = "datalog_analysis",
  LORA_MODE = "lora_mode",
  LORA_PERCENTAGE = "lora_percentage",
}