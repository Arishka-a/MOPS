import { useControlPinMutation } from '../api';
import type { BolidPinSchema } from '../types';
import BolidPinRow from './BolidPinRow';

interface Props {
  pins: BolidPinSchema[];
  pinIdToHostname: Map<string, string>;
  statuses: number[] | undefined;
  isStatusLoading: boolean;
}

const HEADERS = ['ID пина', 'Номер', 'Устройство', 'Состояние', 'Управление'];

const BolidPinsTable = ({ pins, pinIdToHostname, statuses, isStatusLoading }: Props) => {
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
            {HEADERS.map((h) => (
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
          {sorted.map((pin) => (
            <BolidPinRow
              key={pin.id}
              pin={pin}
              hostname={pinIdToHostname.get(pin.id)}
              stateValue={statuses?.[pin.number - 1]}
              isStatusLoading={isStatusLoading}
              isControlling={isControlling}
              onControl={handleControl}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BolidPinsTable;
