import StatusBadge from '../../devices/components/common/StatusBadge';
import DeviceLink from '../../devices/components/common/DeviceLink';
import type { BolidPinSchema } from '../types';

interface Props {
  pin: BolidPinSchema;
  hostname: string | undefined;
  stateValue: number | undefined;
  isStatusLoading: boolean;
  isControlling: boolean;
  onControl: (pin: BolidPinSchema, state: 0 | 1) => void;
}

const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

const BolidPinRow = ({
  pin,
  hostname,
  stateValue,
  isStatusLoading,
  isControlling,
  onControl,
}: Props) => {
  const isOn = stateValue === 1;
  const isOff = stateValue === 0;
  const isUnbound = !hostname;

  const renderState = () => {
    if (isStatusLoading && stateValue === undefined) {
      return <span className="text-[12px] text-[#6B7280]">Загрузка...</span>;
    }
    if (isOn) return <StatusBadge text="Включен" color="green" />;
    if (isOff) return <StatusBadge text="Выключен" color="red" />;
    return <span className="text-[12px] text-[#6B7280]">—</span>;
  };

  return (
    <tr className="border-b border-[#D1D5DB]/30">
      <td className="px-[14px] py-[10px] font-semibold" style={monoFont}>
        pin_{String(pin.number).padStart(2, '0')}
      </td>
      <td className="px-[14px] py-[10px]" style={monoFont}>
        {pin.number}
      </td>
      <td className="px-[14px] py-[10px]">
        <DeviceLink hostname={hostname} />
      </td>
      <td className="px-[14px] py-[10px]">{renderState()}</td>
      <td className="px-[14px] py-[10px]">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isUnbound || isControlling || isOn}
            onClick={() => onControl(pin, 1)}
            className="border border-[#16A34A] text-[#16A34A] rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-[#DCFCE7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Вкл
          </button>
          <button
            type="button"
            disabled={isUnbound || isControlling || isOff}
            onClick={() => onControl(pin, 0)}
            className="border border-[#DC2626] text-[#DC2626] rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-[#FEE2E2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Выкл
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BolidPinRow;
