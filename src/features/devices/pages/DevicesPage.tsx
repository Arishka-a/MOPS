import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDevicesQuery } from '../api';
import type { DeviceFilters } from '../types';
import { DeviceConnectionStatus } from '../../../types/enums';
import DeviceFiltersBar from '../components/DeviceFiltersBar';
import DevicesTable from '../components/DevicesTable';
import ReservationPanel from '../components/ReservationPanel';
import StatusBadge from '../components/StatusBadge';

const DevicesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DeviceFilters>({});

  const queryFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined)
  ) as DeviceFilters;

  const { data: devices = [], isLoading } = useGetDevicesQuery(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined
  );

  const onlineCount = devices.filter(
    (d) => d.connection_status === DeviceConnectionStatus.ONLINE
  ).length;
  const offlineCount = devices.filter(
    (d) => d.connection_status === DeviceConnectionStatus.OFFLINE
  ).length;

  return (
    <div style={{ padding: 36, maxWidth: 1100, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-extrabold">Устройства</h2>
        <div className="flex gap-2 items-center">
          {devices.length > 0 && (
            <>
              <StatusBadge text={`${onlineCount} онлайн`} color="green" />
              <StatusBadge text={`${offlineCount} офлайн`} color="red" />
            </>
          )}
          <button
            onClick={() => navigate('/controllers')}
            className="bg-[#2626E0] text-white border-none rounded-[14px] px-7 py-3 text-[15px] font-bold cursor-pointer ml-3 hover:bg-[#1e1ebf]"
          >
            Контроллеры
          </button>
        </div>
      </div>

      <DeviceFiltersBar filters={filters} onChange={setFilters} />
      <DevicesTable devices={devices} isLoading={isLoading} />
      <ReservationPanel />
    </div>
  );
};

export default DevicesPage;