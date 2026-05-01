export interface BolidSchema {
  name: string;
  port: string;
  pin_capacity: number;
  baudrate: number;
  parity: string;
  stopbits: number;
  bytesize: number;
  slave_address: number;
}

export interface BolidPinSchema {
  id: string;
  number: number;
  bolid_name: string;
}

export interface BolidPinControlRequest {
  hostname: string;
  state: 0 | 1;
  bolid_name: string;
}

export interface BolidPinControlResponse {
  bolid_pin: BolidPinSchema;
  message: string;
}

export interface BolidPinsStatusResponse {
  bolid_name: string;
  status: number[];
}
