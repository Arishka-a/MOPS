import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDevicesQuery } from '../api';
import type { DeviceFilters } from '../types';
import DeviceFiltersBar from '../components/DeviceFiltersBar';
import DevicesTable from '../components/DevicesTable';
import ReservationPanel from '../components/ReservationPanel';
import AppHeader from '../../../components/layout/AppHeader';

const DevicesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DeviceFilters>({});

  const queryFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined),
  ) as DeviceFilters;

  const { data: devices = [], isLoading } = useGetDevicesQuery(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined,
  );

  return (
    <div style={{ padding: '36px 120px', margin: '0 auto' }}>
      <AppHeader
        title="Устройства"
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/images')}
              className="border border-brand bg-transparent text-brand rounded-md px-5 py-3 text-[15px] font-bold cursor-pointer hover:bg-brand-tint transition-colors"
            >
              Образы
            </button>
            <button
              type="button"
              onClick={() => navigate('/controllers')}
              className="bg-brand text-white border-none rounded-md px-7 py-3 text-[15px] font-bold cursor-pointer hover:bg-brand-hover"
            >
              Контроллеры
            </button>
          </>
        }
      />

      <DeviceFiltersBar filters={filters} onChange={setFilters} />
      <DevicesTable devices={devices} isLoading={isLoading} />
      <ReservationPanel />
    </div>
  );
};

export default DevicesPage;
