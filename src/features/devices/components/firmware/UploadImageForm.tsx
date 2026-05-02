import { useState, useRef } from 'react';
import { useUploadImageFileMutation } from '../../api';
import { savePendingInstall } from '../../hooks/imageBindingPersist';

interface Props {
  hostname: string;
}

const UploadImageForm = ({ hostname }: Props) => {
  const [uploadFile, { isLoading }] = useUploadImageFileMutation();
  const [releaseType, setReleaseType] = useState('release');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!selectedFile) {
      setError('Выберите файл');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('device_hostname', hostname);
    formData.append('release_type', releaseType);
    try {
      const image = await uploadFile({ formData, hostname }).unwrap();
      if (image?.id) savePendingInstall(hostname, image.id);
      setSuccess('Файл загружен');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setError('Ошибка при загрузке файла');
    }
  };

  return (
    <div className="flex-1 rounded-lg border-[2px] border-brand bg-white p-7">
      <h3 className="text-[16px] font-bold text-center mb-5">Загрузить файл</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-muted font-semibold">
            Файл <span className="text-danger">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="border border-border rounded-sm px-3 py-[9px] text-[14px] bg-white outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-muted font-semibold">
            Тип релиза <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={releaseType}
            onChange={(e) => setReleaseType(e.target.value)}
            placeholder="release"
            className="border border-border rounded-sm px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-brand text-white border-none rounded-md px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-brand-hover disabled:opacity-50 self-center"
        >
          {isLoading ? 'Загрузка...' : 'Загрузить'}
        </button>
        {error && <p className="text-[12px] text-danger">{error}</p>}
        {success && <p className="text-[12px] text-success">{success}</p>}
      </div>
    </div>
  );
};

export default UploadImageForm;
