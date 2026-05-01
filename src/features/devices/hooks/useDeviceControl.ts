import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { devicesApi, useReloadDeviceMutation } from '../api';
import { useControlPinMutation, useGetBolidPinsStatusQuery } from '../../bolid/api';
import { useInstallTaskPolling } from './useInstallTaskPolling';
import { errMessage } from '../utils/errMessage';
import type { DeviceSchema, InstallTaskStatus } from '../types';

interface UseDeviceControlResult {
  reload: () => void;
  powerOff: () => void;
  powerOn: () => void;

  isReloading: boolean;
  isPowerToggling: boolean;
  canTogglePower: boolean;
  isPoweredOff: boolean | undefined;
  error: string | null;
  clearError: () => void;
}

export const useDeviceControl = (device: DeviceSchema | undefined): UseDeviceControlResult => {
  const dispatch = useDispatch();
  const [reloadDevice, { isLoading: isStartingReload }] = useReloadDeviceMutation();
  const [controlPin, { isLoading: isPowerToggling }] = useControlPinMutation();

  const [reloadTaskId, setReloadTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const outputPower = device?.output_power ?? null;
  const canTogglePower = outputPower !== null;

  const { data: pinsStatus } = useGetBolidPinsStatusQuery(
    outputPower?.bolid_name ?? '',
    { skip: !canTogglePower, pollingInterval: 5000 },
  );

  const isPoweredOff: boolean | undefined = (() => {
    if (!outputPower) return undefined;
    const state = pinsStatus?.status?.[outputPower.number - 1];
    if (state === undefined) return undefined;
    return state === 0;
  })();

  const reload = useCallback(async () => {
    if (!device) return;
    setError(null);
    try {
      const raw = await reloadDevice({
        hostname: device.hostname,
        ssh_username: 'root',
        retries: 3,
        retry_delay: 5,
      }).unwrap();
      const result = raw as { task_id?: string; id?: string };
      const taskId = result.task_id ?? result.id ?? null;
      setReloadTaskId(taskId);
      if (!taskId) {
        setError('Сервер не вернул идентификатор задачи перезагрузки');
      }
    } catch (e) {
      setError(`Не удалось запустить перезагрузку: ${errMessage(e)}`);
    }
  }, [device, reloadDevice]);

  const togglePower = useCallback(async (state: 0 | 1) => {
    if (!device || !outputPower) return;
    setError(null);
    try {
      await controlPin({
        hostname: device.hostname,
        state,
        bolid_name: outputPower.bolid_name,
      }).unwrap();
    } catch (e) {
      const action = state === 0 ? 'отключить' : 'включить';
      setError(`Не удалось ${action} устройство: ${errMessage(e)}`);
    }
  }, [device, outputPower, controlPin]);

  const powerOff = useCallback(() => togglePower(0), [togglePower]);
  const powerOn = useCallback(() => togglePower(1), [togglePower]);

  useInstallTaskPolling({
    taskId: reloadTaskId,
    kind: 'reload',
    onStatus: useCallback((status: InstallTaskStatus) => {
      if (status.status === 'completed') {
        setReloadTaskId(null);
        if (device) {
          dispatch(devicesApi.util.invalidateTags([
            { type: 'Device', id: device.hostname },
            'Devices',
          ]));
        }
      } else if (status.status === 'failed' || status.status === 'cancelled') {
        setReloadTaskId(null);
        setError(`Перезагрузка завершилась с ошибкой: ${status.status}`);
      }
    }, [device, dispatch]),
    onError: useCallback((message: string) => {
      console.warn('[device reload polling]', message);
    }, []),
  });

  const [prevHostname, setPrevHostname] = useState(device?.hostname);
  if (prevHostname !== device?.hostname) {
    setPrevHostname(device?.hostname);
    setReloadTaskId(null);
    setError(null);
  }

  const isReloading = isStartingReload || reloadTaskId !== null;

  return {
    reload,
    powerOff,
    powerOn,
    isReloading,
    isPowerToggling,
    canTogglePower,
    isPoweredOff,
    error,
    clearError: useCallback(() => setError(null), []),
  };
};
