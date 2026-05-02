import type { ReservationSchema } from '../../types';
import { formatDateTime } from '../../../../utils/formatDate';

interface Props {
  reservation: ReservationSchema;
}

const ReservationFoundDetails = ({ reservation }: Props) => {
  const { id, user, devices_hostnames, time_start, time_end } = reservation;

  return (
    <div className="text-[12px] text-[#6B7280] bg-[#F3F4F6] rounded-[10px] p-3 mt-3 space-y-1">
      <p>
        <span className="font-semibold">ID:</span> {id}
      </p>
      <p>
        <span className="font-semibold">Пользователь:</span> {user.username}
      </p>
      {devices_hostnames && devices_hostnames.length > 0 && (
        <p>
          <span className="font-semibold">Устройства:</span>{' '}
          {devices_hostnames.join(', ')}
        </p>
      )}
      <p>
        <span className="font-semibold">Период:</span>{' '}
        {formatDateTime(time_start ?? '')} → {formatDateTime(time_end ?? '')}
      </p>
    </div>
  );
};

export default ReservationFoundDetails;
