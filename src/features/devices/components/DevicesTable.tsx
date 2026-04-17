import { useNavigate } from 'react-router-dom';
import type { DeviceSchema } from '../types';
import { DeviceConnectionStatus, DeviceReservationStatus } from '../../../types/enums';
import StatusBadge from '../components/StatusBadge';

interface Props {
  devices: DeviceSchema[];
  isLoading?: boolean;
}

const DeviceTable = ({ devices, isLoading }: Props) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Загрузка...
      </div>
    );
  }

  const getConnectionBadge = (status: string | null) => {
    if (status === DeviceConnectionStatus.ONLINE) {
      return <StatusBadge text="Онлайн" color="green" />;
    }
    return <StatusBadge text="Офлайн" color="red" />;
  };

  const getStageBadge = (stage: string | null) => {
    if (!stage || stage === 'none') {
      return <StatusBadge text="Нет" color="gray" />;
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

  if (devices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Устройства не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">Hostname</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">Тип</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">IP-адрес</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">MAC-адрес</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">Подключение</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">Стадия</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">Бронь</th>
            <th className="text-right py-3 px-4"></th>
          </tr>
        </thead>
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
      </table>
    </div>
  );
};

export default DeviceTable;