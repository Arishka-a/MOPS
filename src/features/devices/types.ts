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

export interface CreateReservationRequest {
  time_start?: string;
  time_end?: string;
  by_hostname?: string[];
  by_type?: Record<string, number>;
  by_type_group?: Record<string, number>;
  any?: number;
}

export interface ReloadDeviceRequest {
  hostname: string;
  ssh_username: string;
  retries: number;
  retry_delay: number;
}

export interface LoadFromShareRequest {
  device_hostname: string;
  release_type: string;
  version: string;
  image_type?: string;
  comparator?: string;
}

export interface InstallTaskStatus {
  task_id: string;
  status: string;
  progress?: string;
  log?: string;
}

export interface SSHCommandRequest {
  hostname: string;
  username: string;
  cmd: string;
  retries: number;
  retry_delay: number;
  cmd_timeout: number;
  port: number;
}

export interface SSHTaskResult {
  stdout: string;
  stderr: string | null;
  retcode: number;
  execution_time_s: number;
}

export interface SSHTaskStatus {
  task_id: string;
  status: string;
  result: SSHTaskResult | null;
  traceback: string | null;
}
