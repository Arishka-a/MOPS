import { useState } from 'react';
import type { DeviceSchema } from '../types';
import {
  useDeleteReservationByHostnameMutation,
  useCreateReservationMutation,
} from '../api';

interface Props {
  device: DeviceSchema;
}

const DeviceInfoTab = ({ device }: Props) => {
  const [deleteReservation, { isLoading: isDeleting }] = useDeleteReservationByHostnameMutation();
  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();

  const [showReserveForm, setShowReserveForm] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [reserveError, setReserveError] = useState('');

  const reservation = device.reservation;

  const handleDeleteReservation = async () => {
    try {
      await deleteReservation(device.hostname).unwrap();
    } catch {
      // 
    }
  };

  const handleCreateReservation = async () => {
    setReserveError('');
    if (!timeStart || !timeEnd) {
      setReserveError('Укажите начало и окончание бронирования');
      return;
    }
    try {
      await createReservation({
        by_hostname: [device.hostname],
        time_start: new Date(timeStart).toISOString(),
        time_end: new Date(timeEnd).toISOString(),
      }).unwrap();
      setShowReserveForm(false);
      setTimeStart('');
      setTimeEnd('');
    } catch {
      setReserveError('Ошибка при создании бронирования');
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const params: { label: string; value: string | number }[] = [
    { label: 'название', value: device.hostname },
    { label: 'тип устройства', value: device.type },
    { label: 'ip-адрес', value: device.ip },
    { label: 'MAC адрес', value: device.mac },
    { label: 'HTTPS порт', value: device.https_port },
    { label: 'WS порт', value: device.ws_port },
    { label: 'RS232 порт', value: device.rs232_port },
    { label: 'SNMP порт', value: device.snmp_port },
    { label: 'Порт обновления', value: device.update_page_port },
  ];

  return (
    <div>
      <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold">Параметры устройства</h3>
          {!reservation && (
            <button
              onClick={() => setShowReserveForm(!showReserveForm)}
              className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf]"
            >
              Забронировать
            </button>
          )}
        </div>

        {showReserveForm && (
          <div className="rounded-[12px] border border-[#D1D5DB] bg-[#F9FAFB] p-5 mb-5">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#6B7280] font-semibold">Начало</label>
                <input
                  type="datetime-local"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#6B7280] font-semibold">Окончание</label>
                <input
                  type="datetime-local"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
                />
              </div>
              <button
                onClick={handleCreateReservation}
                disabled={isCreating}
                className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf] disabled:opacity-50"
              >
                {isCreating ? 'Создание...' : 'Создать'}
              </button>
              <button
                onClick={() => { setShowReserveForm(false); setReserveError(''); }}
                className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
            {reserveError && <p className="text-[12px] text-[#DC2626] mt-2">{reserveError}</p>}
          </div>
        )}

        <table className="w-full border-collapse text-[14px]">
          <tbody>
            {params.map((p, idx) => (
              <tr key={idx} className="border-b border-[#E5E7EB]">
                <td className="py-3 px-4 text-[#6B7280] font-medium w-[200px]">{p.label}</td>
                <td
                  className="py-3 px-4 font-semibold text-right"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {p.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservation && (
        <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-bold mb-1">Бронирование</h3>
              <p className="text-[14px] text-[#6B7280] mb-1">{reservation.user.username}</p>
              <p className="text-[14px] text-[#6B7280]">
                {reservation.time_start ? formatDate(reservation.time_start) : '—'}
                {' - '}
                {reservation.time_end ? formatDate(reservation.time_end) : '—'}
              </p>
            </div>
            <button
              onClick={handleDeleteReservation}
              disabled={isDeleting}
              className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
            >
              {isDeleting ? 'Снятие...' : 'Снять'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceInfoTab;
