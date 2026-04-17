export const DeviceType = {
  TEDIX_V1_02: 'tedix-v1-02',
  TEDIX_V2_02: 'tedix-v2-02',
  TEDIX_V2_LTE_02: 'tedix-v2-lte-02',
  TEDIX_R1_02: 'tedix-r1-02',
  TEDIX_R2D1_02: 'tedix-r2d1-02',
  TEDIX_R2D1_RTK_02: 'tedix-r2d1-rtk-02',
  TEDIX_R2D2_RTK_02: 'tedix-r2d2-rtk-02',
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

export const DeviceConnectionStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;
export type DeviceConnectionStatus = (typeof DeviceConnectionStatus)[keyof typeof DeviceConnectionStatus];

export const DeviceTestStage = {
  TESTING: 'testing',
  FIRMWARE: 'firmware',
  IDLE: 'idle',
} as const;
export type DeviceTestStage = (typeof DeviceTestStage)[keyof typeof DeviceTestStage];

export const DeviceTypeGroup = {
  OBU: 'obu',
  RSU: 'rsu',
} as const;
export type DeviceTypeGroup = (typeof DeviceTypeGroup)[keyof typeof DeviceTypeGroup];

export const DeviceReservationStatus = {
  FREE: 'free',
  RESERVED: 'reserved',
} as const;
export type DeviceReservationStatus = (typeof DeviceReservationStatus)[keyof typeof DeviceReservationStatus];

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  CI: 'ci',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SshUser = {
  ROOT: 'root',
} as const;
export type SshUser = (typeof SshUser)[keyof typeof SshUser];

export const ImageType = {
  DEV: 'dev',
  RELEASE: 'release',
} as const;
export type ImageType = (typeof ImageType)[keyof typeof ImageType];