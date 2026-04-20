import type { DeviceSchema } from '../types';
import DevicesTableHead from './DevicesTableHead';
import DevicesTableBody from './DevicesTableBody';

interface Props {
  devices: DeviceSchema[];
  isLoading?: boolean;
}

const DevicesTable = ({ devices, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
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