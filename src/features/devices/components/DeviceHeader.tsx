import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceConnectionStatus, DeviceTestStage, DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from './StatusBadge';

interface Props {
  device: DeviceSchema;
  onReload: () => void;
  onPowerOff: () => void;
  isReloading?: boolean;
  isPoweringOff?: boolean;
}

const connMap: Record<string, { text: string; color: 'green' | 'red' }> = {
  [DeviceConnectionStatus.AVAILABLE]: { text: 'Онлайн', color: 'green' },
  [DeviceConnectionStatus.UNAVAILABLE]: { text: 'Офлайн', color: 'red' },
};

const stageMap: Record<string, { text: string; color: 'green' | 'red' | 'orange' | 'blue' | 'gray' }> = {
  [DeviceTestStage.NONE]: { text: 'Свободно', color: 'gray' },
  [DeviceTestStage.INSTALLING_IMAGE]: { text: 'Прошивка', color: 'orange' },
  [DeviceTestStage.MANUAL_TEST]: { text: 'Тестирование', color: 'orange' },
  [DeviceTestStage.AUTO_TEST]: { text: 'Авто тест', color: 'orange' },
  [DeviceTestStage.RELOADING]: { text: 'Перезагрузка', color: 'orange' },
};

const DeviceHeader = ({ device, onReload, onPowerOff, isReloading, isPoweringOff }: Props) => {
  const navigate = useNavigate();

  const conn = connMap[device.connection_status] ?? { text: device.connection_status, color: 'gray' as const };
  const stage = stageMap[device.test_stage] ?? { text: device.test_stage, color: 'gray' as const };
  const isReserved = device.reservation_status === DeviceReservationStatus.RESERVED;

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate('/')}
        className="text-[24px] bg-transparent border-none cursor-pointer px-2 py-1 hover:opacity-70"
        title="Назад к списку"
      >
        ←
      </button>

      <span
        className="text-[20px] font-extrabold"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {device.hostname}
      </span>

      <StatusBadge text={conn.text} color={conn.color} />
      {isReserved && <StatusBadge text="Занято" color="orange" />}
      <StatusBadge text={stage.text} color={stage.color} />

      <div className="ml-auto flex gap-3">
        <button
          onClick={onReload}
          disabled={isReloading}
          className="bg-[#16A34A] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#15803d] disabled:opacity-50"
        >
          {isReloading ? 'Перезагрузка...' : 'Перезагрузить'}
        </button>
        <button
          onClick={onPowerOff}
          disabled={isPoweringOff}
          className="bg-[#DC2626] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#b91c1c] disabled:opacity-50"
        >
          {isPoweringOff ? 'Отключение...' : 'Отключить'}
        </button>
      </div>
    </div>
  );
};

export default DeviceHeader;
