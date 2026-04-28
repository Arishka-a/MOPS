import { useState } from 'react';
import type { DeviceSchema } from '../../types';
import { useDeviceParams } from '../../hooks/useDeviceParams';
import CreateReservationForm from './CreateReservationForm';
import ReservationInfo from './ReservationInfo'
import DeviceParamsTable from '../common/DeviceParamsTable'

interface Props {
  device: DeviceSchema;
}

const DeviceInfoTab = ({ device }: Props) => {
  const [showReserveForm, setShowReserveForm] = useState(false);
  const reservation = device.reservation;
  const params = useDeviceParams(device);

  return (
    <div>
      <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold">Параметры устройства</h3>
          {!reservation && (
            <button
              onClick={() => setShowReserveForm(!showReserveForm)}
              className="bg-[#2626E0] text-white border-none rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-[#1e1ebf]"
            >
              Забронировать
            </button>
          )}
        </div>

        {showReserveForm && (
          <CreateReservationForm
            hostname={device.hostname}
            onClose={() => setShowReserveForm(false)}
          />
        )}

        <DeviceParamsTable params={params} />

      </div>

      {reservation && (
        <ReservationInfo
          reservation={reservation}
          hostname={device.hostname}
        />
      )}
    </div>
  );
};

export default DeviceInfoTab;
