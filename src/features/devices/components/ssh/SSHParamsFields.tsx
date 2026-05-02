import type { SSHCommandParams } from '../../hooks/useSSHQueue';

interface Props {
  params: SSHCommandParams;
  onChange: (patch: Partial<SSHCommandParams>) => void;
}

interface FieldDef {
  key: keyof SSHCommandParams;
  label: string;
  min: number;
  max?: number;
}

const FIELDS: FieldDef[] = [
  { key: 'retries', label: 'Попытки', min: 1 },
  { key: 'retry_delay', label: 'Задержка (с)', min: 0 },
  { key: 'cmd_timeout', label: 'Таймаут (с)', min: 1 },
  { key: 'port', label: 'Порт', min: 1, max: 65535 },
];

const SSHParamsFields = ({ params, onChange }: Props) => {
  return (
    <>
      {FIELDS.map(({ key, label, min, max }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">{label}</label>
          <input
            type="number"
            min={min}
            max={max}
            value={params[key]}
            onChange={(e) => onChange({ [key]: Number(e.target.value) })}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
      ))}
    </>
  );
};

export default SSHParamsFields;
