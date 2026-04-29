import { useState } from 'react';
import { useGetBolidPinsStatusQuery } from '../api';
import type { BolidSchema, BolidPinSchema } from '../types';
import BolidPinsTable from './BolidPinsTable';

interface Props {
  bolid: BolidSchema;
  pins: BolidPinSchema[];
  pinIdToHostname: Map<string, string>;
  forceExpanded?: boolean;
}

const BolidCard = ({ bolid, pins, pinIdToHostname, forceExpanded }: Props) => {
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const expanded = forceExpanded || manuallyExpanded;

  const { data: statusData, isLoading: isStatusLoading } = useGetBolidPinsStatusQuery(
    bolid.name,
    { skip: !expanded, pollingInterval: expanded ? 5000 : 0 },
  );

  return (
    <div className="rounded-[20px] border border-[#D1D5DB] bg-white mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setManuallyExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-7 py-5 bg-transparent border-none cursor-pointer hover:bg-[#F9FAFB] transition-colors"
      >
        <span
          className="text-[18px] font-bold"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {bolid.name}
        </span>
        <span
          className={`text-[#6B7280] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-7 pb-5">
          <BolidPinsTable
            pins={pins}
            pinIdToHostname={pinIdToHostname}
            statuses={statusData?.status}
            isStatusLoading={isStatusLoading}
          />
        </div>
      )}
    </div>
  );
};

export default BolidCard;
