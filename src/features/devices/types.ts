import type {
  DeviceType,
  DeviceConnectionStatus,
  DeviceTestStage,
  DeviceTypeGroup,
  DeviceReservationStatus,
  ImageType,
} from '../../types/enums';
import type { UserSchema } from '../auth/types';

export interface BolidPinSchema {
  id: string;
  number: number;
  bolid_name: string;
}

export interface ImageSchema {
  id: string;
  image_type: ImageType;
  image_version: string | null;
  device_type: DeviceType | null;
  release_type: string | null;
  filename: string;
  filepath: string;
  was_installed: boolean;
}

export interface ReservationSchema {
  id: string;
  user: UserSchema;
  time_start: string | null;
  time_end: string | null;
}

export interface DeviceSchema {
  hostname: string;
  type: DeviceType;
  mac: string;
  ip: string;
  https_port: number | null;
  ws_port: number | null;
  rs232_port: string;
  snmp_port: number | null;
  update_page_port: number | null;
  output_power: BolidPinSchema | null;
  output_boot: BolidPinSchema | null;
  reservation_status: DeviceReservationStatus | null;
  image: ImageSchema | null;
  reservation: ReservationSchema | null;
  connection_status: DeviceConnectionStatus | null;
  test_stage: DeviceTestStage | null;
  deactivated: boolean;
  type_group: DeviceTypeGroup;
}

export interface DeviceFilters {
  types?: DeviceType[];
  connection_status?: DeviceConnectionStatus;
  test_stage?: DeviceTestStage;
  type_group?: DeviceTypeGroup;
  deactivated?: boolean;
  reservation_status?: DeviceReservationStatus;
}

export interface DeviceUpdateRequest {
  type?: DeviceType;
  mac?: string;
  ip?: string;
  https_port?: number | null;
  ws_port?: number | null;
  rs232_port?: string;
  snmp_port?: number | null;
  update_page_port?: number | null;
  deactivated?: boolean;
  test_stage?: DeviceTestStage;
}