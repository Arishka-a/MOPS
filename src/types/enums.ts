export const DeviceType = {
  STB_A: 'stb_a',
  STB_C: 'stb_c',
  ONT_A: 'ont_a',
  ONT_B: 'ont_b',
  CPE_A: 'cpe_a',
  CPE_B: 'cpe_b',
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
  STB: 'stb',
  ONT: 'ont',
  CPE: 'cpe',
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