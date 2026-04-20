import { useState } from 'react';
import {
  useLazyGetReservationByIdQuery,
  useLazyGetReservationByHostnameQuery,
  useDeleteReservationByIdMutation,
  useDeleteReservationByHostnameMutation,
} from '../api';
import type { ReservationSchema } from '../types';

const ReservationPanel = () => {
  const [searchId, setSearchId] = useState('');
  const [foundById, setFoundById] = useState<ReservationSchema | null>(null);
  const [idError, setIdError] = useState('');

  const [searchHostname, setSearchHostname] = useState('');
  const [foundByHostname, setFoundByHostname] = useState<ReservationSchema | null>(null);
  const [hostnameError, setHostnameError] = useState('');

  const [cleanupTime, setCleanupTime] = useState('11:55');

  const [triggerGetById] = useLazyGetReservationByIdQuery();
  const [triggerGetByHostname] = useLazyGetReservationByHostnameQuery();
  const [deleteById, { isLoading: isDeletingById }] = useDeleteReservationByIdMutation();
  const [deleteByHostname, { isLoading: isDeletingByHostname }] = useDeleteReservationByHostnameMutation();

  const handleSearchById = async () => {
    if (!searchId.trim()) return;
    setIdError('');
    setFoundById(null);
    try {
      const result = await triggerGetById(searchId.trim()).unwrap();
      setFoundById(result);
    } catch {
      setIdError('Бронирование не найдено');
    }
  };

  const handleDeleteById = async () => {
    if (!searchId.trim()) return;
    try {
      await deleteById(searchId.trim()).unwrap();
      setFoundById(null);
      setSearchId('');
    } catch {
      setIdError('Ошибка при снятии');
    }
  };

  const handleSearchByHostname = async () => {
    if (!searchHostname.trim()) return;
    setHostnameError('');
    setFoundByHostname(null);
    try {
      const result = await triggerGetByHostname(searchHostname.trim()).unwrap();
      setFoundByHostname(result);
    } catch {
      setHostnameError('Бронирование не найдено');
    }
  };

  const handleDeleteByHostname = async () => {
    if (!searchHostname.trim()) return;
    try {
      await deleteByHostname(searchHostname.trim()).unwrap();
      setFoundByHostname(null);
      setSearchHostname('');
    } catch {
      setHostnameError('Ошибка при снятии');
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-[22px] font-extrabold mb-5">Бронь</h2>

      <div className="flex gap-5 flex-wrap">
        <div className="flex-1 min-w-[300px] flex flex-col gap-5">
          <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7">
            <div className="text-[16px] font-bold text-center mb-5">Поиск по ID</div>
            <div className="flex gap-[10px] items-end">
              <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                <label className="text-[12px] text-[#6B7280] font-semibold">
                  ID брони <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="res-001"
                  className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
              <button
                onClick={handleSearchById}
                className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50"
              >
                Найти
              </button>
              <button
                onClick={handleDeleteById}
                disabled={isDeletingById}
                className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
              >
                Снять
              </button>
            </div>
            {idError && <p className="text-[12px] text-[#DC2626] mt-2">{idError}</p>}
            {foundById && (
              <div className="text-[12px] text-[#6B7280] bg-[#F3F4F6] rounded-[10px] p-3 mt-3 space-y-1">
                <p><span className="font-semibold">ID:</span> {foundById.id}</p>
                <p><span className="font-semibold">Пользователь:</span> {foundById.user.username}</p>
                {foundById.devices_hostnames && foundById.devices_hostnames.length > 0 && (
                  <p><span className="font-semibold">Устройства:</span> {foundById.devices_hostnames.join(', ')}</p>
                )}
                <p><span className="font-semibold">Период:</span> {formatDate(foundById.time_start ?? '')} → {formatDate(foundById.time_end ?? '')}</p>
              </div>
            )}
          </div>

          <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7">
            <div className="text-[16px] font-bold text-center mb-5">Поиск по устройству</div>
            <div className="flex gap-[10px] items-end">
              <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                <label className="text-[12px] text-[#6B7280] font-semibold">
                  Устройство <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={searchHostname}
                  onChange={(e) => setSearchHostname(e.target.value)}
                  placeholder="tedix-001"
                  className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
              <button
                onClick={handleSearchByHostname}
                className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50"
              >
                Найти
              </button>
              <button
                onClick={handleDeleteByHostname}
                disabled={isDeletingByHostname}
                className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
              >
                Снять
              </button>
            </div>
            {hostnameError && <p className="text-[12px] text-[#DC2626] mt-2">{hostnameError}</p>}
            {foundByHostname && (
              <div className="text-[12px] text-[#6B7280] bg-[#F3F4F6] rounded-[10px] p-3 mt-3 space-y-1">
                <p><span className="font-semibold">ID:</span> {foundByHostname.id}</p>
                <p><span className="font-semibold">Пользователь:</span> {foundByHostname.user.username}</p>
                {foundByHostname.devices_hostnames && foundByHostname.devices_hostnames.length > 0 && (
                  <p><span className="font-semibold">Устройства:</span> {foundByHostname.devices_hostnames.join(', ')}</p>
                )}
                <p><span className="font-semibold">Период:</span> {formatDate(foundByHostname.time_start ?? '')} → {formatDate(foundByHostname.time_end ?? '')}</p>
              </div>
            )}
          </div>
        </div>

        {/*<div className="flex-1 min-w-[300px]">
          <div className="rounded-[20px] border-[3px] border-[#2626E0] bg-white p-7 h-full flex flex-col items-center justify-center text-center">
            <div className="text-[16px] font-bold mb-1">Очистка бронирований</div>
            <div className="text-[14px] text-[#6B7280] mb-5">Время автоматической очистки</div>
            <input
              type="time"
              value={cleanupTime}
              onChange={(e) => setCleanupTime(e.target.value)}
              className="border border-[#D1D5DB] rounded-[10px] px-6 py-3 text-[40px] font-bold text-center mb-5 outline-none"
              style={{ fontFamily: "'JetBrains Mono', monospace", width: 220 }}
            />
            <button className="bg-[#2626E0] text-white border-none rounded-[14px] px-7 py-3 text-[15px] font-bold cursor-pointer mb-2 w-[220px] hover:bg-[#1e1ebf]">
              Сохранить
            </button>
            <button className="bg-[#EAEBFF] text-[#2626E0] border-none rounded-[14px] px-7 py-3 text-[15px] font-bold cursor-pointer w-[220px] hover:bg-[#d8d9ff]">
              Запустить
            </button>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default ReservationPanel;