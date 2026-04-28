import { useRef, useState } from 'react';
import { useSendFileToDeviceMutation } from '../../api';
import type { SendFileToDutResult } from '../../types';

interface Props {
  hostname: string;
}

const DEFAULT_USERNAME = 'root';
const DEFAULT_PATH = '/tmp/firmware.bin';
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 5;
const DEFAULT_PORT = 22;

const errMessage = (e: unknown): string => {
  if (typeof e === 'object' && e !== null) {
    const anyE = e as { data?: unknown; error?: unknown; message?: unknown };
    if (anyE.data && typeof anyE.data === 'object') {
      const detail = (anyE.data as { detail?: unknown }).detail;
      if (typeof detail === 'string') return detail;
    }
    if (typeof anyE.data === 'string') return anyE.data;
    if (typeof anyE.error === 'string') return anyE.error;
    if (typeof anyE.message === 'string') return anyE.message;
  }
  return String(e);
};

const SendFileForm = ({ hostname }: Props) => {
  const [sendFile, { isLoading }] = useSendFileToDeviceMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [pathOnDut, setPathOnDut] = useState(DEFAULT_PATH);
  const [retries, setRetries] = useState(DEFAULT_RETRIES);
  const [retryDelay, setRetryDelay] = useState(DEFAULT_RETRY_DELAY);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SendFileToDutResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    if (!selectedFile) {
      setError('Выберите файл');
      return;
    }
    if (!username.trim()) {
      setError('Укажите имя пользователя');
      return;
    }
    if (!pathOnDut.trim()) {
      setError('Укажите путь на устройстве');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('hostname', hostname);
    formData.append('username', username.trim());
    formData.append('path_on_dut', pathOnDut.trim());
    formData.append('retries', String(retries));
    formData.append('retry_delay', String(retryDelay));
    formData.append('port', String(port));

    try {
      const res = (await sendFile({ formData }).unwrap()) as SendFileToDutResult;
      setResult(res);
      if (res.success) {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (e) {
      setError(errMessage(e) || 'Ошибка при отправке файла');
    }
  };

  return (
    <div className="rounded-[20px] border-[2px] border-[#2626E0] bg-white p-7 w-[560px] max-w-full">
      <h3 className="text-[16px] font-bold text-center mb-5">Отправить файл на устройство</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            Файл <span className="text-[#DC2626]">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            Имя пользователя <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="root"
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            Путь на устройстве <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={pathOnDut}
            onChange={(e) => setPathOnDut(e.target.value)}
            placeholder="/tmp/firmware.bin"
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[12px] text-[#6B7280] font-semibold">Попытки</label>
            <input
              type="number"
              min={1}
              value={retries}
              onChange={(e) => setRetries(Number(e.target.value))}
              className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[12px] text-[#6B7280] font-semibold">Задержка (с)</label>
            <input
              type="number"
              min={0}
              value={retryDelay}
              onChange={(e) => setRetryDelay(Number(e.target.value))}
              className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[12px] text-[#6B7280] font-semibold">SSH порт</label>
            <input
              type="number"
              min={1}
              max={65535}
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf] disabled:opacity-50 self-start"
        >
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>

        {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}

        {result && (
          <div
            className={`rounded-[10px] p-3 text-[12px] ${
              result.success ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'
            }`}
          >
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
        )}
      </div>
    </div>
  );
};

export default SendFileForm;
