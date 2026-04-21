import type { ReservationSchema } from '../types';
import { useDeleteReservationByHostnameMutation } from '../api';
import { formatDate } from '../../../utils/formatDate';

interface Props {
  reservation: ReservationSchema;
  hostname: string;
}

const ReservationInfo = ({ reservation, hostname }: Props) => {
  const [deleteReservation, { isLoading }] = useDeleteReservationByHostnameMutation();

  const handleDelete = async () => {
    try {
      await deleteReservation(hostname).unwrap();
    } catch {
      //
    }
  };

  return (
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
          onClick={handleDelete}
          disabled={isLoading}
          className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
        >
          {isLoading ? 'Снятие...' : 'Снять'}
        </button>
      </div>
    </div>
  );
};

export default ReservationInfo;
