import { useState } from 'react';
import { useLoadImageFromShareMutation } from '../../api';

interface Props {
  hostname: string;
}

const LoadFromShareForm = ({ hostname }: Props) => {
  const [loadFromShare, { isLoading }] = useLoadImageFromShareMutation();
  const [releaseType, setReleaseType] = useState('release');
  const [version, setVersion] = useState('');
  const [imageType, setImageType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!version.trim()) {
      setError('Укажите версию');
      return;
    }
    try {
      await loadFromShare({
        device_hostname: hostname,
        release_type: releaseType,
        version: version.trim(),
        image_type: imageType.trim() || undefined,
      }).unwrap();
      setSuccess('Образ загружен');
      setVersion('');
      setImageType('');
    } catch {
      setError('Ошибка при загрузке из шары');
    }
  };

  return (
    <div className="flex-1 rounded-[20px] border-[2px] border-[#2626E0] bg-white p-7">
      <h3 className="text-[16px] font-bold text-center mb-5">Загрузить из шары</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            Тип релиза <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={releaseType}
            onChange={(e) => setReleaseType(e.target.value)}
            placeholder="release"
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">
            Версия <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="2.4.1"
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-[#6B7280] font-semibold">Тип образа</label>
          <input
            type="text"
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            placeholder="Не указан"
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf] disabled:opacity-50 self-center"
        >
          {isLoading ? 'Загрузка...' : 'Загрузить'}
        </button>
        {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
        {success && <p className="text-[12px] text-[#16A34A]">{success}</p>}
      </div>
    </div>
  );
};

export default LoadFromShareForm;
