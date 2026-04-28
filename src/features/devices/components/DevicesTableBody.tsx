import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceConnectionStatus, DeviceTestStage, DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from './common/StatusBadge';

interface Props {
  devices: DeviceSchema[];
}

const connMap: Record<string, { text: string; color: 'green' | 'red' }> = {
  [DeviceConnectionStatus.AVAILABLE]: { text: 'Онлайн', color: 'green' },
  [DeviceConnectionStatus.UNAVAILABLE]: { text: 'Офлайн', color: 'red' },
};

const stageMap: Record<string, { text: string; color: 'green' | 'red' | 'orange' | 'blue' | 'gray' }> = {
  [DeviceTestStage.NONE]: { text: 'Свободно', color: 'gray' },
  [DeviceTestStage.INSTALLING_IMAGE]: { text: 'Прошивка', color: 'orange' },
  [DeviceTestStage.MANUAL_TEST]: { text: 'Ручной тест', color: 'orange' },
  [DeviceTestStage.AUTO_TEST]: { text: 'Авто тест', color: 'orange' },
  [DeviceTestStage.RELOADING]: { text: 'Перезагрузка', color: 'orange' },
};

const ReservationBadge = ({ device }: { device: DeviceSchema }) => {
  const isReserved = device.reservation_status === DeviceReservationStatus.RESERVED;
  const reservationId = device.reservation?.id;

  const handleClick = () => {
    if (reservationId) {
      navigator.clipboard.writeText(reservationId);
    }
  };

  if (!isReserved) {
    return <StatusBadge text="Свободно" color="gray" />;
  }

  return (
    <div
      title={reservationId ? `ID: ${reservationId} (клик — скопировать)` : 'Занято'}
      onClick={handleClick}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      <StatusBadge text="Занято" color="blue" />
    </div>
  );
};

const DevicesTableBody = ({ devices }: Props) => {
  const navigate = useNavigate();

  return (
    <tbody>
      {devices.map((d, idx) => {
        const conn = connMap[d.connection_status] ?? { text: d.connection_status, color: 'gray' as const };
        const stage = stageMap[d.test_stage] ?? { text: d.test_stage, color: 'gray' as const };

        return (
          <tr key={d.hostname + idx} className="border-b border-[#D1D5DB]/30">
            <td
              className="px-[14px] py-[10px] font-semibold"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
            <td className="px-[14px] py-[10px]"><ReservationBadge device={d} /></td>
            <td className="px-[14px] py-[10px] text-right">
              <button
                type="button"
                onClick={() => navigate(`/devices/${d.hostname}`)}
                className="border border-[#2626E0] text-[#2626E0] rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-[#EAEBFF] transition-colors"
              >
                Подробнее
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default DevicesTableBody;