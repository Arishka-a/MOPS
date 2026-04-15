import {
  DeviceType,
  DeviceConnectionStatus,
  DeviceTestStage,
  DeviceTypeGroup,
  DeviceReservationStatus,
} from '../../types/enums';

export interface DeviceSchema {
  hostname: string;
  type: DeviceType;
  mac: string;
  ip: string;
  https_port: number;
  ws_port: number;
  rs232_port: number;
  snmp_port: number;
  update_page_port: number;
  deactivated: boolean;
  test_stage: DeviceTestStage;
  connection_status: DeviceConnectionStatus;
  reservation_status: DeviceReservationStatus;
  type_group: DeviceTypeGroup;
}

export interface DeviceUpdateRequest {
  type?: DeviceType;
  mac?: string;
  ip?: string;
  https_port?: number;
  ws_port?: number;
  rs232_port?: number;
  snmp_port?: number;
  update_page_port?: number;
  deactivated?: boolean;
  test_stage?: DeviceTestStage;
}

export interface DeviceFilters {
  types?: DeviceType[];
  connection_status?: DeviceConnectionStatus;
  test_stage?: DeviceTestStage;
  type_group?: DeviceTypeGroup;
  deactivated?: boolean;
  reservation_status?: DeviceReservationStatus;
}

export interface ReservationSchema {
  id: string;
  user: string;
  role: string;
  time_start: string;
  time_end: string;
  devices: string[];
}