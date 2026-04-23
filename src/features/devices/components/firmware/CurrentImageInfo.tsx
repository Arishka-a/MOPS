import type { ImageSchema } from '../../types';

interface Props {
  image: ImageSchema;
  onInstall: () => void;
  isInstalling: boolean;
}

const CurrentImageInfo = ({ image, onInstall, isInstalling }: Props) => {
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
      <button
        onClick={onInstall}
        disabled={isInstalling}
        className="bg-[#EAEBFF] text-[#2626E0] border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#d8d9ff] disabled:opacity-50"
      >
        {isInstalling ? 'Установка...' : 'Установить'}
      </button>
    </>
  );
};

export default CurrentImageInfo;
