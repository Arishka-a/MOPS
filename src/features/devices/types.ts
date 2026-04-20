import {
  DeviceType,
  DeviceConnectionStatus,
  DeviceTestStage,
  DeviceTypeGroup,
  DeviceReservationStatus,
} from '../../types/enums';
import type { UserSchema } from '../auth/types';

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
  reservation?: ReservationSchema | null;
  image?: ImageSchema | null;
  output_power?: BolidPinSchema | null;
  output_boot?: BolidPinSchema | null;
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
  user: UserSchema;
  time_start: string | null;
  time_end: string | null;
  devices_hostnames?: string[] | null;
}

export interface BolidPinSchema {
  id: string;
  number: number;
  bolid_name: string;
}

export interface ImageSchema {
  id: string;
  image_type: string;
  image_version: string | null;
  device_type: DeviceType | null;
  release_type: string | null;
  filename: string;
  filepath: string;
  was_installed: boolean;
}