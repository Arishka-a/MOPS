import type { DeviceSchema } from '../types';
import DevicesTableHead from './DevicesTableHead';
import DevicesTableBody from './DevicesTableBody';

interface Props {
  devices: DeviceSchema[];
  isLoading: boolean;
}

const DevicesTable = ({ devices, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-[14px]">
        Загрузка устройств...
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-[14px]">
        Устройства не найдены
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-[12px] border border-[#D1D5DB] mb-5">
      <table className="w-full border-collapse text-[13px]">
        <DevicesTableHead />
        <DevicesTableBody devices={devices} />
      </table>
    </div>
  );
};

export default DevicesTable;