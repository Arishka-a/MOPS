import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../devices/components/common/StatusBadge';
import { useControlPinMutation } from '../api';
import type { BolidPinSchema } from '../types';

interface Props {
  pins: BolidPinSchema[];
  pinIdToHostname: Map<string, string>;
  statuses: number[] | undefined;
  isStatusLoading: boolean;
}

const BolidPinsTable = ({ pins, pinIdToHostname, statuses, isStatusLoading }: Props) => {
  const navigate = useNavigate();
  const [controlPin, { isLoading: isControlling }] = useControlPinMutation();

  if (pins.length === 0) {
    return <p className="text-[14px] text-[#6B7280] py-4">У этого контроллера нет пинов</p>;
  }

  const sorted = [...pins].sort((a, b) => a.number - b.number);

  const handleControl = async (pin: BolidPinSchema, state: 0 | 1) => {
    const hostname = pinIdToHostname.get(pin.id);
    if (!hostname) return;
    try {
      await controlPin({ hostname, state, bolid_name: pin.bolid_name }).unwrap();
    } catch {
      // 
    }
  };

  return (
    <div className="overflow-auto rounded-[12px] border border-[#D1D5DB] mt-4">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['ID пина', 'Номер', 'Устройство', 'Состояние', 'Управление'].map((h) => (
              <th
                key={h}
                className="text-left px-[14px] py-[10px] bg-[#F3F4F6] font-bold text-[11px] uppercase tracking-[0.5px] text-[#6B7280] border-b border-[#D1D5DB] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((pin) => {
            const hostname = pinIdToHostname.get(pin.id);
            const stateValue = statuses?.[pin.number - 1];
            const isOn = stateValue === 1;
            const isOff = stateValue === 0;

            return (
              <tr key={pin.id} className="border-b border-[#D1D5DB]/30">
                <td
                  className="px-[14px] py-[10px] font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  pin_{String(pin.number).padStart(2, '0')}
                </td>
                <td className="px-[14px] py-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {pin.number}
                </td>
                <td className="px-[14px] py-[10px]">
                  {hostname ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/devices/${hostname}`)}
                      className="text-[#2626E0] font-semibold cursor-pointer hover:underline bg-transparent border-none p-0"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {hostname}
                    </button>
                  ) : (
                    <span className="text-[#6B7280]">—</span>
                  )}
                </td>
                <td className="px-[14px] py-[10px]">
                  {isStatusLoading && stateValue === undefined ? (
                    <span className="text-[12px] text-[#6B7280]">Загрузка...</span>
                  ) : isOn ? (
                    <StatusBadge text="Включен" color="green" />
                  ) : isOff ? (
                    <StatusBadge text="Выключен" color="red" />
                  ) : (
                    <span className="text-[12px] text-[#6B7280]">—</span>
                  )}
                </td>
                <td className="px-[14px] py-[10px]">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!hostname || isControlling || isOn}
                      onClick={() => handleControl(pin, 1)}
                      className="border border-[#16A34A] text-[#16A34A] rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-[#DCFCE7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Вкл
                    </button>
                    <button
                      type="button"
                      disabled={!hostname || isControlling || isOff}
                      onClick={() => handleControl(pin, 0)}
                      className="border border-[#DC2626] text-[#DC2626] rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-[#FEE2E2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Выкл
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BolidPinsTable;
