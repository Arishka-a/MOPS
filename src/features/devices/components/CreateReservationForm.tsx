import { useState } from 'react';
import { useCreateReservationMutation } from '../api';

interface Props {
  hostname: string;
  onClose: () => void;
}

const CreateReservationForm = ({ hostname, onClose }: Props) => {
  const [createReservation, { isLoading }] = useCreateReservationMutation();
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    if (!timeStart || !timeEnd) {
      setError('Укажите начало и окончание бронирования');
      return;
    }
    try {
      await createReservation({
        by_hostname: [hostname],
        time_start: new Date(timeStart).toISOString(),
        time_end: new Date(timeEnd).toISOString(),
      }).unwrap();
      onClose();
    } catch {
      setError('Ошибка при создании бронирования');
    }
  };

  return (
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
          onClick={handleCreate}
          disabled={isLoading}
          className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf] disabled:opacity-50"
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </button>
        <button
          onClick={onClose}
          className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-gray-50"
        >
          Отмена
        </button>
      </div>
      {error && <p className="text-[12px] text-[#DC2626] mt-2">{error}</p>}
    </div>
  );
};

export default CreateReservationForm;
