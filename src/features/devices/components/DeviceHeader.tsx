import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from './common/StatusBadge';
import { getConnectionDisplay, getTestStageDisplay } from '../utils/deviceStatus';

interface Props {
  device: DeviceSchema;
  onReload: () => void;
  onPowerOff: () => void;
  onPowerOn: () => void;
  isReloading?: boolean;
  isPowerToggling?: boolean;
  canTogglePower?: boolean;
  isPoweredOff?: boolean;
}

const SOFT_BUTTON_BASE =
  'border-none rounded-md px-6 py-[10px] text-[14px] font-bold cursor-pointer ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const SOFT_BRAND_BUTTON =
  `${SOFT_BUTTON_BASE} bg-brand-tint text-brand hover:bg-indigo-200`;

const SOFT_SUCCESS_BUTTON =
  `${SOFT_BUTTON_BASE} bg-success-tint text-success hover:bg-green-200`;

const SOFT_DANGER_BUTTON =
  `${SOFT_BUTTON_BASE} bg-danger-tint text-danger hover:bg-red-200`;

const DeviceHeader = ({
  device,
  onReload,
  onPowerOff,
  onPowerOn,
  isReloading,
  isPowerToggling,
  canTogglePower = true,
  isPoweredOff,
}: Props) => {
  const navigate = useNavigate();

  const conn = getConnectionDisplay(device.connection_status);
  const stage = getTestStageDisplay(device.test_stage);
  const isReserved = device.reservation_status === DeviceReservationStatus.RESERVED;

  const togglerDisabled = !canTogglePower || isPowerToggling;
  const togglerTitle = !canTogglePower
    ? 'У устройства не настроено реле питания'
    : undefined;

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
          className={SOFT_BRAND_BUTTON}
        >
          {isReloading ? 'Перезагрузка...' : 'Перезагрузить'}
        </button>

        {isPoweredOff ? (
          <button
            onClick={onPowerOn}
            disabled={togglerDisabled}
            title={togglerTitle}
            className={SOFT_SUCCESS_BUTTON}
          >
            {isPowerToggling ? 'Включение...' : 'Включить'}
          </button>
        ) : (
          <button
            onClick={onPowerOff}
            disabled={togglerDisabled}
            title={togglerTitle}
            className={SOFT_DANGER_BUTTON}
          >
            {isPowerToggling ? 'Отключение...' : 'Отключить'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceHeader;
