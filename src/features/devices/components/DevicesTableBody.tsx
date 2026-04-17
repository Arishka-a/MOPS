import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceConnectionStatus, DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from './StatusBadge';

interface Props {
  devices: DeviceSchema[];
}

const getConnectionBadge = (status: string | null) => {
  if (status === DeviceConnectionStatus.ONLINE) {
    return <StatusBadge text="Доступен" color="green" />;
  }
  return <StatusBadge text="Недоступен" color="red" />;
};

const getStageBadge = (stage: string | null) => {
  if (!stage || stage === 'none') {
    return <StatusBadge text="Свободно" color="gray" />;
  }
  const labels: Record<string, string> = {
    installing_image: 'Прошивка',
    reloading: 'Перезагрузка',
    manual_test: 'Тест (ручн.)',
    auto_test: 'Тест (авто)',
  };
  return <StatusBadge text={labels[stage] ?? stage} color="orange" />;
};

const getReservationBadge = (status: string | null) => {
  if (status === DeviceReservationStatus.RESERVED) {
    return <StatusBadge text="Занято" color="orange" />;
  }
  return <StatusBadge text="Свободно" color="green" />;
};

const DevicesTableBody = ({ devices }: Props) => {
  const navigate = useNavigate();

  return (
    <tbody>
      {devices.map((device) => (
        <tr
          key={device.hostname}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="py-3 px-4 font-medium text-indigo-600">{device.hostname}</td>
          <td className="py-3 px-4 text-gray-700">{device.type}</td>
          <td className="py-3 px-4 text-gray-700">{device.ip}</td>
          <td className="py-3 px-4 text-gray-700 font-mono text-xs">{device.mac}</td>
          <td className="py-3 px-4">{getConnectionBadge(device.connection_status)}</td>
          <td className="py-3 px-4">{getStageBadge(device.test_stage)}</td>
          <td className="py-3 px-4">{getReservationBadge(device.reservation_status)}</td>
          <td className="py-3 px-4 text-right">
            <button
              type="button"
              onClick={() => navigate(`/devices/${device.hostname}`)}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg
                         hover:bg-indigo-50 transition-colors"
            >
              Подробнее
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default DevicesTableBody;