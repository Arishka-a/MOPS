import type { DeviceSchema } from '../types';

export const useDeviceParams = (device: DeviceSchema) => {
  return [
    { label: 'название', value: device.hostname },
    { label: 'тип устройства', value: device.type },
    { label: 'ip-адрес', value: device.ip },
    { label: 'MAC адрес', value: device.mac },
    { label: 'HTTPS порт', value: device.https_port },
    { label: 'WS порт', value: device.ws_port },
    { label: 'RS232 порт', value: device.rs232_port },
    { label: 'SNMP порт', value: device.snmp_port },
    { label: 'Порт обновления', value: device.update_page_port },
  ] as const;
};