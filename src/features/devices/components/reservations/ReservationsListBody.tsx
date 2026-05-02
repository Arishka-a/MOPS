import type { ReservationSchema } from '../../types';
import ReservationCard from './ReservationCard';

interface Props {
  reservations: ReservationSchema[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  deletingId: string | null;
  onRetry: () => void;
  onDelete: (id: string) => void;
}

const ReservationsListBody = ({
  reservations,
  isLoading,
  isError,
  error,
  deletingId,
  onRetry,
  onDelete,
}: Props) => {
  if (isLoading) {
    return (
      <div className="text-[14px] text-[#6B7280] py-4 text-center">
        Загрузка...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-[14px] text-[#DC2626] py-4 text-center">
        Не удалось загрузить список.{' '}
        <button
          type="button"
          onClick={onRetry}
          className="underline cursor-pointer bg-transparent border-none text-[#2626E0]"
        >
          повторить
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-[14px] text-[#6B7280] py-4 text-center">
        Активных броней нет
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="text-[12px] text-[#DC2626] mb-3 text-center">{error}</div>
      )}

      <div className="flex flex-col gap-3">
        {reservations.map((r) => (
          <ReservationCard
            key={r.id}
            reservation={r}
            isDeleting={deletingId === r.id}
            onDelete={() => onDelete(r.id)}
          />
        ))}
      </div>
    </>
  );
};

export default ReservationsListBody;
