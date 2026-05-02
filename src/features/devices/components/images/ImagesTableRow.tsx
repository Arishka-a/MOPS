import type { ImageSchema } from '../../types';

interface Props {
  image: ImageSchema;
  onDelete: () => void;
  isDeleting: boolean;
}

const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const ImagesTableRow = ({ image, onDelete, isDeleting }: Props) => {
  return (
    <tr className="border-b border-[#D1D5DB]/30">
      <td
        className="px-[14px] py-[10px] font-semibold"
        style={MONO}
        title={image.filepath}
      >
        {image.filename}
      </td>
      <td className="px-[14px] py-[10px]">{image.image_type}</td>
      <td className="px-[14px] py-[10px]" style={MONO}>
        {image.image_version ?? '—'}
      </td>
      <td className="px-[14px] py-[10px]">{image.device_type ?? '—'}</td>
      <td className="px-[14px] py-[10px]">{image.release_type ?? '—'}</td>
      <td className="px-[14px] py-[10px]">
        <span
          className={
            image.was_installed
              ? 'text-[#15803d] font-semibold'
              : 'text-[#6B7280]'
          }
        >
          {image.was_installed ? 'да' : 'нет'}
        </span>
      </td>
      <td className="px-[14px] py-[10px] text-right">
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[10px] px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50"
        >
          Удалить
        </button>
      </td>
    </tr>
  );
};

export default ImagesTableRow;
