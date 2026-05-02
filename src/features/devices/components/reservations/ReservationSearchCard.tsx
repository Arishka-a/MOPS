import {
  useLazyGetReservationByIdQuery,
  useLazyGetReservationByHostnameQuery,
  useDeleteReservationByIdMutation,
  useDeleteReservationByHostnameMutation,
} from '../../api';
import { useReservationSearch } from '../../hooks/useReservationSearch';
import ReservationFoundDetails from './ReservationFoundDetails';

type SearchKind = 'by_id' | 'by_hostname';

interface Props {
  kind: SearchKind;
}

const KIND_CONFIG = {
  by_id: {
    title: 'Поиск по ID',
    label: 'ID брони',
    placeholder: 'res-001',
  },
  by_hostname: {
    title: 'Поиск по устройству',
    label: 'Устройство',
    placeholder: 'tedix-001',
  },
} as const;

const ReservationSearchCard = ({ kind }: Props) => {
  const [triggerById] = useLazyGetReservationByIdQuery();
  const [triggerByHostname] = useLazyGetReservationByHostnameQuery();
  const deleteByIdResult = useDeleteReservationByIdMutation();
  const deleteByHostnameResult = useDeleteReservationByHostnameMutation();

  const triggerSearch = kind === 'by_id' ? triggerById : triggerByHostname;
  const [deleteTrigger, deleteState] =
    kind === 'by_id' ? deleteByIdResult : deleteByHostnameResult;

  const { query, setQuery, found, error, isDeleting, search, remove } =
    useReservationSearch({
      triggerSearch,
      triggerDelete: deleteTrigger,
      deleteState,
    });

  const cfg = KIND_CONFIG[kind];

  return (
    <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7">
      <div className="text-[16px] font-bold text-center mb-5">{cfg.title}</div>

      <div className="flex gap-[10px] items-end">
        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            {cfg.label} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={cfg.placeholder}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <button
          type="button"
          onClick={search}
          className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50"
        >
          Найти
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={isDeleting}
          className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
        >
          Снять
        </button>
      </div>

      {error && <p className="text-[12px] text-[#DC2626] mt-2">{error}</p>}
      {found && <ReservationFoundDetails reservation={found} />}
    </div>
  );
};

export default ReservationSearchCard;
