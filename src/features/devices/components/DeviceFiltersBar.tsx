import {
  DeviceType,
  DeviceConnectionStatus,
  DeviceTestStage,
  DeviceTypeGroup,
  DeviceReservationStatus,
} from '../../../types/enums';
import type { DeviceFilters as DeviceFiltersType } from '../types';

interface Props {
  filters: DeviceFiltersType;
  onChange: (filters: DeviceFiltersType) => void;
}

const DeviceFiltersBar = ({ filters, onChange }: Props) => {
  const update = (patch: Partial<DeviceFiltersType>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div
      className="mb-5 rounded-[20px] border border-[#D1D5DB] bg-white px-6 py-4"
    >
      <div className="flex gap-[10px] flex-wrap">
        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">Тип устройства</label>
          <select
            value={filters.types?.[0] ?? ''}
            onChange={(e) =>
              update({ types: e.target.value ? [e.target.value as DeviceType] : undefined })
            }
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
          >
            <option value="">Все типы</option>
            {Object.values(DeviceType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">Подключение</label>
          <select
            value={filters.connection_status ?? ''}
            onChange={(e) =>
              update({
                connection_status: e.target.value
                  ? (e.target.value as DeviceConnectionStatus)
                  : undefined,
              })
            }
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
          >
            <option value="">Все</option>
            <option value={DeviceConnectionStatus.AVAILABLE}>Онлайн</option>
            <option value={DeviceConnectionStatus.UNAVAILABLE}>Офлайн</option>
          </select>
        </div>

        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">Стадия</label>
          <select
            value={filters.test_stage ?? ''}
            onChange={(e) =>
              update({
                test_stage: e.target.value
                  ? (e.target.value as DeviceTestStage)
                  : undefined,
              })
            }
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
          >
            <option value="">Все</option>
            <option value={DeviceTestStage.AUTO_TEST}>Авто тест</option>
            <option value={DeviceTestStage.MANUAL_TEST}>Ручной тест</option>
            <option value={DeviceTestStage.INSTALLING_IMAGE}>Прошивка</option>
            <option value={DeviceTestStage.RELOADING}>Перезагрузка</option>
            <option value={DeviceTestStage.NONE}>Свободно</option>
          </select>
        </div>

        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">Группа</label>
          <select
            value={filters.type_group ?? ''}
            onChange={(e) =>
              update({
                type_group: e.target.value
                  ? (e.target.value as DeviceTypeGroup)
                  : undefined,
              })
            }
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
          >
            <option value="">Все</option>
            {Object.values(DeviceTypeGroup).map((g) => (
              <option key={g} value={g}>{g.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
          <label className="text-[12px] text-[#6B7280] font-semibold">Бронирование</label>
          <select
            value={filters.reservation_status ?? ''}
            onChange={(e) =>
              update({
                reservation_status: e.target.value
                  ? (e.target.value as DeviceReservationStatus)
                  : undefined,
              })
            }
            className="border border-[#D1D5DB] rounded-[10px] px-3 py-[9px] text-[14px] bg-white outline-none w-full"
          >
            <option value="">Все</option>
            <option value={DeviceReservationStatus.AVAILABLE}>Свободно</option>
            <option value={DeviceReservationStatus.RESERVED}>Забронировано</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeviceFiltersBar;