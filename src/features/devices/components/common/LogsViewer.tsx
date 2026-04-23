import { useEffect, useRef } from 'react';

interface Props {
  logs: string[];
  title?: string;
}

const LogsViewer = ({ logs, title = 'Логи' }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div>
      <h3 className="text-[18px] font-bold mb-3">{title}</h3>
      <div
        ref={ref}
        className="rounded-[12px] bg-[#1E1E2E] text-[#E0E0E0] p-5 min-h-[160px] max-h-[300px] overflow-auto"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '1.6' }}
      >
        {logs.length > 0 ? (
          logs.map((line, i) => (
            <div key={i}>
              <span className="text-[#16A34A]">{line.startsWith('stdout') ? 'stdout: ' : ''}</span>
              <span className="text-[#DC2626]">{line.startsWith('stderr') ? 'stderr: ' : ''}</span>
              <span>{line.replace(/^(stdout|stderr):\s*/, '')}</span>
            </div>
          ))
        ) : (
          <span className="text-[#6B7280]">Нет данных</span>
        )}
      </div>
    </div>
  );
};

export default LogsViewer;
