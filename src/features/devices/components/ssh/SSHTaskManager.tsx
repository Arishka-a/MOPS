import { useState } from 'react';
import {
  useLazyGetSSHStatusQuery,
  useCancelSSHTaskMutation,
} from '../../api';
import type { SSHTaskStatus } from '../../types';

interface Props {
  taskId: string;
  onTaskIdChange: (value: string) => void;
}

const SSHTaskManager = ({ taskId, onTaskIdChange }: Props) => {
  const [status, setStatus] = useState<SSHTaskStatus | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [triggerStatus, { isFetching: isChecking }] = useLazyGetSSHStatusQuery();
  const [cancelTask, { isLoading: isCancelling }] = useCancelSSHTaskMutation();

  const handleStatus = async () => {
    const id = taskId.trim();
    if (!id) return;
    setError('');
    setInfo('');
    setStatus(null);
    try {
      const result = await triggerStatus(id).unwrap() as SSHTaskStatus;
      setStatus(result);
    } catch {
      setError('Задача не найдена');
    }
  };

  const handleCancel = async () => {
    const id = taskId.trim();
    if (!id) return;
    setError('');
    setInfo('');
    try {
      await cancelTask(id).unwrap();
      setInfo('Задача отменена');
      setStatus(null);
    } catch {
      setError('Ошибка при отмене задачи');
    }
  };

  return (
    <div className="mt-5">
      <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7">
        <div className="text-[16px] font-bold text-center mb-5">Управление задачей</div>
        <div className="flex gap-[10px] items-end">
          <div className="flex flex-col gap-[5px] flex-1 min-w-0">
            <label className="text-[12px] text-[#6B7280] font-semibold">
              ID задачи <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={taskId}
              onChange={(e) => onTaskIdChange(e.target.value)}
              placeholder="task-xxxx"
              className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <button
            onClick={handleStatus}
            disabled={isChecking}
            className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50 disabled:opacity-50"
          >
            {isChecking ? '...' : 'Статус'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
          >
            Отменить
          </button>
        </div>
        {error && <p className="text-[12px] text-[#DC2626] mt-2">{error}</p>}
        {info && <p className="text-[12px] text-[#16A34A] mt-2">{info}</p>}
      </div>

      {status && (
        <div className="mt-4">
          <h3 className="text-[14px] text-[#6B7280] font-semibold mb-2">Результат</h3>
          <div
            className="rounded-[12px] bg-[#1E1E2E] text-[#16A34A] p-5"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '1.6' }}
          >
            {status.result ? (
              <>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  stdout: {status.result.stdout || '...'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  stderr: {status.result.stderr ?? 'null'}
                </div>
                <div>retcode: {status.result.retcode}</div>
                <div>время выполнения: {status.result.execution_time_s.toFixed(2)} сек</div>
              </>
            ) : (
              <div className="text-[#E0E0E0]">
                статус: {status.status || 'неизвестно'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SSHTaskManager;
