
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
  THREHSOLD = "threshold"
  
}