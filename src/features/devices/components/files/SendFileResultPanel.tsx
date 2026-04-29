import type { SendFileToDutResult } from '../../types';

interface Props {
  result: SendFileToDutResult;
}

const SendFileResultPanel = ({ result }: Props) => {
  const colorClass = result.success
    ? 'bg-[#DCFCE7] text-[#166534]'
    : 'bg-[#FEE2E2] text-[#991B1B]';

  return (
    <div className={`rounded-[10px] p-3 text-[12px] ${colorClass}`}>
      <p className="font-semibold mb-1">
        {result.success ? 'Файл успешно передан' : 'Не удалось передать файл'}
      </p>
      {result.message && <p>{result.message}</p>}
      {result.remote_path && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          путь: {result.remote_path}
        </p>
      )}
      {result.file_size != null && <p>размер: {result.file_size} Б</p>}
      {result.transfer_time_s != null && (
        <p>время передачи: {result.transfer_time_s.toFixed(2)} с</p>
      )}
    </div>
  );
};

export default SendFileResultPanel;
