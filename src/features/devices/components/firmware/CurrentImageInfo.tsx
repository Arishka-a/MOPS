import type { ImageSchema } from '../../types';

interface Props {
  image: ImageSchema;
  onInstall: () => void;
  isInstalling: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

const CurrentImageInfo = ({ image, onInstall, isInstalling, onDelete, isDeleting }: Props) => {
  const handleDeleteClick = () => {
    if (window.confirm('Удалить образ с устройства? Это действие необратимо.')) {
      onDelete();
    }
  };

  return (
    <>
      <table className="w-full border-collapse text-[14px] mb-4">
        <tbody>
          <tr className="border-b border-[#E5E7EB]">
            <td className="py-3 px-4 text-[#6B7280] font-medium w-[200px]">id</td>
            <td className="py-3 px-4 font-semibold text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {image.id}
            </td>
            <td className="py-3 px-4 text-[#6B7280] font-medium w-[200px]">тип образа</td>
            <td className="py-3 px-4 font-semibold text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {image.image_type}
            </td>
          </tr>
          <tr className="border-b border-[#E5E7EB]">
            <td className="py-3 px-4 text-[#6B7280] font-medium">версия</td>
            <td className="py-3 px-4 font-semibold text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {image.image_version ?? '—'}
            </td>
            <td className="py-3 px-4 text-[#6B7280] font-medium">тип релиза</td>
            <td className="py-3 px-4 font-semibold text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {image.release_type ?? '—'}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-3">
        <button
          onClick={onInstall}
          disabled={isInstalling || isDeleting}
          className="bg-[#EAEBFF] text-[#2626E0] border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#d8d9ff] disabled:opacity-50"
        >
          {isInstalling ? 'Установка...' : 'Установить'}
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isInstalling || isDeleting}
          className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#fecaca] disabled:opacity-50"
        >
          {isDeleting ? 'Удаление...' : 'Удалить образ'}
        </button>
      </div>
    </>
  );
};

export default CurrentImageInfo;
