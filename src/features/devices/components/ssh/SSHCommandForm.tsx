import type { SSHCommandParams } from '../../hooks/useSSHQueue';

interface Props {
  params: SSHCommandParams;
  onChange: (patch: Partial<SSHCommandParams>) => void;
  onExecute: () => void;
  isExecuting: boolean;
  canExecute: boolean;
}

const SSHCommandForm = ({ params, onChange, onExecute, isExecuting, canExecute }: Props) => {
  return (
    <div className="rounded-[20px] border-[2px] border-[#2626E0] bg-white p-7 w-[260px] flex-shrink-0">
      <h3 className="text-[16px] font-bold text-center mb-5">Выполнить через очередь</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">Попытки</label>
          <input
            type="number"
            min={1}
            value={params.retries}
            onChange={(e) => onChange({ retries: Number(e.target.value) })}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">Задержка (с)</label>
          <input
            type="number"
            min={0}
            value={params.retry_delay}
            onChange={(e) => onChange({ retry_delay: Number(e.target.value) })}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">Таймаут (с)</label>
          <input
            type="number"
            min={1}
            value={params.cmd_timeout}
            onChange={(e) => onChange({ cmd_timeout: Number(e.target.value) })}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">Порт</label>
          <input
            type="number"
            min={1}
            max={65535}
            value={params.port}
            onChange={(e) => onChange({ port: Number(e.target.value) })}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <button
          onClick={onExecute}
          disabled={!canExecute || isExecuting}
          className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf] disabled:opacity-50 self-start"
        >
          {isExecuting ? 'Выполняется...' : 'Выполнить'}
        </button>
      </div>
    </div>
  );
};

export default SSHCommandForm;
