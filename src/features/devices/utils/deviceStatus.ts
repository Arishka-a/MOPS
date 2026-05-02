import {
  DeviceConnectionStatus,
  DeviceTestStage,
} from '../../../types/enums';

export type StatusColor = 'green' | 'red' | 'orange' | 'blue' | 'gray';

export interface StatusDisplay {
  text: string;
  color: StatusColor;
}

const CONNECTION_DISPLAY: Record<string, StatusDisplay> = {
  [DeviceConnectionStatus.AVAILABLE]: { text: 'Онлайн', color: 'green' },
  [DeviceConnectionStatus.UNAVAILABLE]: { text: 'Офлайн', color: 'red' },
};

const TEST_STAGE_DISPLAY: Record<string, StatusDisplay> = {
  [DeviceTestStage.NONE]: { text: 'Свободно', color: 'gray' },
  [DeviceTestStage.INSTALLING_IMAGE]: { text: 'Прошивка', color: 'orange' },
  [DeviceTestStage.MANUAL_TEST]: { text: 'Ручной тест', color: 'orange' },
  [DeviceTestStage.AUTO_TEST]: { text: 'Авто тест', color: 'orange' },
  [DeviceTestStage.RELOADING]: { text: 'Перезагрузка', color: 'orange' },
};

const fallback = (raw: string): StatusDisplay => ({ text: raw, color: 'gray' });

export const getConnectionDisplay = (status: string): StatusDisplay =>
  CONNECTION_DISPLAY[status] ?? fallback(status);

export const getTestStageDisplay = (stage: string): StatusDisplay =>
  TEST_STAGE_DISPLAY[stage] ?? fallback(stage);
