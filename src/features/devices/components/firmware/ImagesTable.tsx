import type { ImageSchema } from '../../types';
import ImagesTableRow from './ImagesTableRow';

interface Props {
  images: ImageSchema[];
  isDeleting: boolean;
  onDeleteRequest: (imageId: string) => void;
}

const HEADERS = [
  'Имя файла',
  'Тип',
  'Версия',
  'Тип устройства',
  'Тип релиза',
  'Установлен',
];

const ImagesTable = ({ images, isDeleting, onDeleteRequest }: Props) => {
  return (
    <div className="overflow-auto rounded-[12px] border border-[#D1D5DB]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h}
                className="text-left px-[14px] py-[10px] bg-[#F3F4F6] font-bold text-[11px] uppercase tracking-[0.5px] text-[#6B7280] border-b border-[#D1D5DB] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
            <th className="bg-[#F3F4F6] border-b border-[#D1D5DB]"></th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => (
            <ImagesTableRow
              key={img.id}
              image={img}
              isDeleting={isDeleting}
              onDelete={() => onDeleteRequest(img.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImagesTable;
