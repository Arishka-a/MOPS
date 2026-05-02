import type { SSHMode } from '../../hooks/useSSHQueue';

interface Props {
  mode: SSHMode;
  onChange: (mode: SSHMode) => void;
}

const HINT: Record<SSHMode, string> = {
  queue: 'Команду можно отменить, статус через task_id.',
  sync: 'Запрос блокируется до завершения, отменить нельзя.',
};

const SSHModeSelector = ({ mode, onChange }: Props) => {
  return (
    <fieldset className="mb-5 border-none p-0 m-0">
      <legend className="text-[12px] text-[#6B7280] font-semibold mb-2">
        Режим
      </legend>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[13px] cursor-pointer">
          <input
            type="radio"
            name="ssh-mode"
            value="queue"
            checked={mode === 'queue'}
            onChange={() => onChange('queue')}
            className="accent-[#2626E0]"
          />
          <span>Через очередь</span>
        </label>

        <label className="flex items-center gap-2 text-[13px] cursor-pointer">
          <input
            type="radio"
            name="ssh-mode"
            value="sync"
            checked={mode === 'sync'}
            onChange={() => onChange('sync')}
            className="accent-[#2626E0]"
          />
          <span>Синхронно</span>
        </label>
      </div>

      <p className="text-[11px] text-[#6B7280] mt-2 leading-snug">{HINT[mode]}</p>
    </fieldset>
  );
};

export default SSHModeSelector;
