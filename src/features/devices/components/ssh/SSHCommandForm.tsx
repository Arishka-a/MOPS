import type { SSHCommandParams, SSHMode } from '../../hooks/useSSHQueue';
import SSHModeSelector from './SSHModeSelector';
import SSHParamsFields from './SSHParamsFields';

interface Props {
  params: SSHCommandParams;
  onChange: (patch: Partial<SSHCommandParams>) => void;
  mode: SSHMode;
  onModeChange: (mode: SSHMode) => void;
  onExecute: () => void;
  isExecuting: boolean;
  canExecute: boolean;
}

const SSHCommandForm = ({
  params,
  onChange,
  mode,
  onModeChange,
  onExecute,
  isExecuting,
  canExecute,
}: Props) => {
  return (
    <div className="rounded-lg border-[2px] border-brand bg-white p-7 w-[260px] flex-shrink-0">
      <h3 className="text-[16px] font-bold text-center mb-5">Параметры запуска</h3>

      <SSHModeSelector mode={mode} onChange={onModeChange} />

      <div className="flex flex-col gap-4">
        <SSHParamsFields params={params} onChange={onChange} />

        <button
          type="button"
          onClick={onExecute}
          disabled={!canExecute || isExecuting}
          className="bg-brand text-white border-none rounded-md px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-brand-hover disabled:opacity-50 self-start"
        >
          {isExecuting ? 'Выполняется...' : 'Выполнить'}
        </button>
      </div>
    </div>
  );
};

export default SSHCommandForm;
