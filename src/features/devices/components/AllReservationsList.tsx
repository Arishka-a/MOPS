import { useState } from 'react';
import { useAllReservations } from '../hooks/useAllReservations';
import ReservationsListBody from './reservations/ReservationsListBody';

const AllReservationsList = () => {
  const [open, setOpen] = useState(false);
  const data = useAllReservations(open);

  return (
    <div className="mt-5 rounded-[20px] border border-[#D1D5DB] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left flex items-center justify-between px-7 py-5 cursor-pointer bg-transparent border-none hover:bg-gray-50 rounded-[20px]"
      >
        <span className="text-[16px] font-bold">
          {open ? 'Скрыть все бронирования' : 'Показать все бронирования'}
        </span>
        <span className="text-[18px] text-[#6B7280] select-none">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-7 pb-7">
          <ReservationsListBody
            reservations={data.sorted}
            isLoading={data.isLoading}
            isError={data.isError}
            error={data.error}
            deletingId={data.deletingId}
            onRetry={data.refetch}
            onDelete={data.handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default AllReservationsList;
