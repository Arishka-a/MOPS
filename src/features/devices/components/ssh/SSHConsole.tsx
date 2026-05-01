import { useEffect, useRef } from 'react';
import type { SSHHistoryEntry } from '../../hooks/useSSHQueue';

interface Props {
  hostname: string;
  history: SSHHistoryEntry[];
  command: string;
  onCommandChange: (value: string) => void;
  onSubmit: () => void;
  isExecuting: boolean;
  onPickTaskId?: (taskId: string) => void;
}

const renderResultBody = (entry: SSHHistoryEntry): { lines: string[]; tone: 'ok' | 'err' | 'muted' } => {
  if (entry.status === 'pending' || entry.status === 'running') {
    return { lines: ['...'], tone: 'muted' };
  }
  if (entry.status === 'cancelled') {
    return { lines: ['[задача отменена]'], tone: 'muted' };
  }
  if (entry.status === 'error') {
    return { lines: [entry.error ?? 'Ошибка выполнения'], tone: 'err' };
  }
  if (entry.status === 'failed') {
    const lines: string[] = [];
    if (entry.result?.stderr) lines.push(entry.result.stderr);
    if (entry.error) lines.push(entry.error);
    if (lines.length === 0) lines.push('Задача завершилась с ошибкой');
    return { lines, tone: 'err' };
  }

  const out: string[] = [];
  if (entry.result?.stdout) out.push(entry.result.stdout);
  if (entry.result?.stderr) out.push(entry.result.stderr);
  if (out.length === 0) out.push('(пустой ответ)');
  return { lines: out, tone: 'ok' };
};

const SSHConsole = ({
  hostname,
  history,
  command,
  onCommandChange,
  onSubmit,
  isExecuting,
  onPickTaskId,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [history, isExecuting]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const prompt = `${hostname}>`;

  return (
    <div
      ref={ref}
      onClick={() => inputRef.current?.focus()}
      className="flex-1 rounded-[12px] bg-[#1E1E2E] text-[#E0E0E0] p-5 min-h-[420px] max-h-[420px] overflow-auto cursor-text"
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '1.6' }}
    >
      {history.length === 0 && !isExecuting && (
        <div className="text-[#fff]">Введите команду и нажмите Enter</div>
      )}

      {history.map((entry) => {
        const { lines, tone } = renderResultBody(entry);
        const toneClass =
          tone === 'ok' ? 'text-[#16A34A]' :
          tone === 'err' ? 'text-[#F87171]' :
          'text-[#6B7280]';
        return (
          <div key={entry.id}>
            <div>
              <span className="text-[#fff]">{prompt} </span>
              <span>{entry.command}</span>
            </div>
            {entry.taskId && (
              <div className="text-[#fff]">
                [task_id:{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickTaskId?.(entry.taskId!);
                  }}
                  className="text-[#9CA3AF] underline cursor-pointer bg-transparent border-none p-0 hover:text-[#E0E0E0]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
                  title="Подставить в поле «Управление задачей»"
                >
                  {entry.taskId}
                </button>
                ]
              </div>
            )}
            {lines.map((line, i) => (
              <div key={i} className={toneClass} style={{ whiteSpace: 'pre-wrap' }}>
                {line}
              </div>
            ))}
          </div>
        );
      })}

      <div className="flex items-center">
        <span className="text-[#fff] mr-2">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => onCommandChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          className="flex-1 bg-transparent border-none outline-none text-[#E0E0E0] disabled:opacity-50"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default SSHConsole;
