import type { ReservationSchema } from '../../types';
import { formatDateTime } from '../../../../utils/formatDate';

interface Props {
  reservation: ReservationSchema;
  onDelete: () => void;
  isDeleting: boolean;
}

const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const copyId = (id: string) => {
  navigator.clipboard.writeText(id).catch(() => {});
};

const ReservationCard = ({ reservation, onDelete, isDeleting }: Props) => {
  const { id, user, devices_hostnames, time_start, time_end } = reservation;

  return (
    <div className="rounded-[12px] border border-[#D1D5DB] p-4 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-[8px] bg-[#EAEBFF] text-[#2626E0] px-2 py-[2px] text-[11px] font-bold uppercase tracking-[0.5px]">
            {user.role}
          </span>
          <span className="font-semibold text-[14px]">{user.username}</span>
          <span
            className="text-[11px] text-[#6B7280] ml-2 cursor-pointer"
            style={MONO}
            title="ID брони (клик — скопировать)"
            onClick={() => copyId(id)}
          >
            {id}
          </span>
        </div>

        {devices_hostnames && devices_hostnames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {devices_hostnames.map((h) => (
              <span
                key={h}
                className="rounded-[6px] bg-[#F3F4F6] px-2 py-[2px] text-[12px]"
                style={MONO}
              >
                {h}
              </span>
            ))}
          </div>
        )}

        <div className="text-[12px] text-[#6B7280]">
          {formatDateTime(time_start ?? '')} → {formatDateTime(time_end ?? '')}
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
      >
        {isDeleting ? 'Снятие...' : 'Снять'}
      </button>
    </div>
  );
};

export default ReservationCard;
