import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBolidsQuery, useGetBolidPinsQuery } from '../api';
import { useGetDevicesQuery } from '../../devices/api';
import type { DeviceSchema } from '../../devices/types';
import type { BolidPinSchema } from '../types';
import BolidSearchBar from '../components/BolidSearchBar';
import BolidCard from '../components/BolidCard';

const buildPinIdToHostnameMap = (devices: DeviceSchema[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const device of devices) {
    if (device.output_power) map.set(device.output_power.id, device.hostname);
    if (device.output_boot) map.set(device.output_boot.id, device.hostname);
  }
  return map;
};

const BolidPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: bolids = [], isLoading: bolidsLoading } = useGetBolidsQuery();
  const { data: allPins = [] } = useGetBolidPinsQuery();
  const { data: devices = [] } = useGetDevicesQuery();

  const pinsByBolidName = useMemo(() => {
    const m = new Map<string, BolidPinSchema[]>();
    for (const pin of allPins) {
      const arr = m.get(pin.bolid_name) ?? [];
      arr.push(pin);
      m.set(pin.bolid_name, arr);
    }
    return m;
  }, [allPins]);

  const pinIdToHostname = useMemo(() => buildPinIdToHostnameMap(devices), [devices]);

  const filteredBolids = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bolids;
    return bolids.filter((b) => b.name.toLowerCase().includes(q));
  }, [bolids, search]);

  const isSearching = search.trim().length > 0;

  return (
    <div style={{ padding: '36px 120px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-transparent border-none text-[24px] cursor-pointer text-[#1F2937] hover:text-[#2626E0] transition-colors"
          aria-label="Назад к устройствам"
        >
          ←
        </button>
        <h2 className="text-[22px] font-extrabold">Контроллеры</h2>
      </div>

      <BolidSearchBar value={search} onChange={setSearch} />

      {bolidsLoading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : filteredBolids.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {isSearching ? 'Контроллеры не найдены' : 'Нет контроллеров'}
        </div>
      ) : (
        filteredBolids.map((bolid) => (
          <BolidCard
            key={bolid.name}
            bolid={bolid}
            pins={pinsByBolidName.get(bolid.name) ?? []}
            pinIdToHostname={pinIdToHostname}
            forceExpanded={isSearching}
          />
        ))
      )}
    </div>
  );
};

export default BolidPage;
