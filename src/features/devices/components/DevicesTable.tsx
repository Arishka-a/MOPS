import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceConnectionStatus, DeviceTestStage, DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from './StatusBadge';

interface Props {
  devices: DeviceSchema[];
  isLoading: boolean;
}

const connMap: Record<DeviceConnectionStatus, { text: string; color: 'green' | 'red' }> = {
  [DeviceConnectionStatus.ONLINE]: { text: 'Онлайн', color: 'green' },
  [DeviceConnectionStatus.OFFLINE]: { text: 'Офлайн', color: 'red' },
};

const stageMap: Record<DeviceTestStage, { text: string; color: 'green' | 'red' | 'orange' | 'blue' | 'gray' }> = {
  [DeviceTestStage.TESTING]: { text: 'Тестирование', color: 'blue' },
  [DeviceTestStage.FIRMWARE]: { text: 'Прошивка', color: 'orange' },
  [DeviceTestStage.IDLE]: { text: 'Свободно', color: 'gray' },
};

const reserveMap: Record<DeviceReservationStatus, { text: string; color: 'green' | 'blue' | 'gray' }> = {
  [DeviceReservationStatus.FREE]: { text: 'Свободно', color: 'gray' },
  [DeviceReservationStatus.RESERVED]: { text: 'Занято', color: 'blue' },
};

const DevicesTable = ({ devices, isLoading }: Props) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-[14px]">
        Загрузка устройств...
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-[14px]">
        Устройства не найдены
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-[12px] border border-[#D1D5DB] mb-5">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['Hostname', 'Тип', 'IP-адрес', 'MAC-адрес', 'Подключение', 'Стадия', 'Активно', 'Бронь'].map((h) => (
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
          {devices.map((d, idx) => {
            const conn = connMap[d.connection_status] ?? { text: d.connection_status, color: 'gray' as const };
            const stage = stageMap[d.test_stage] ?? { text: d.test_stage, color: 'gray' as const };
            const reserve = reserveMap[d.reservation_status] ?? { text: d.reservation_status, color: 'gray' as const };

            return (
              <tr key={d.hostname + idx} className="border-b border-[#D1D5DB]/30">
                <td
                  className="px-[14px] py-[10px] font-semibold text-[#2626E0] cursor-pointer hover:underline"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  onClick={() => navigate(`/devices/${d.hostname}`)}
                >
                  {d.hostname}
                </td>
                <td className="px-[14px] py-[10px]">{d.type}</td>
                <td className="px-[14px] py-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.ip}</td>
                <td className="px-[14px] py-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.mac}</td>
                <td className="px-[14px] py-[10px]"><StatusBadge text={conn.text} color={conn.color} /></td>
                <td className="px-[14px] py-[10px]"><StatusBadge text={stage.text} color={stage.color} /></td>
                <td className="px-[14px] py-[10px]">
                  <StatusBadge
                    text={d.deactivated ? 'Нет' : 'Да'}
                    color={d.deactivated ? 'red' : 'green'}
                  />
                </td>
                <td className="px-[14px] py-[10px]"><StatusBadge text={reserve.text} color={reserve.color} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DevicesTable;