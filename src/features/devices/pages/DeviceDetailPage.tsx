import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDeviceQuery } from '../api';
import { useDeviceControl } from '../hooks/useDeviceControl';
import DeviceHeader from '../components/DeviceHeader';
import DeviceTabs from '../components/DeviceTabs';
import type { DeviceTab } from '../components/DeviceTabs';
import DeviceInfoTab from '../components/info/DeviceInfoTab';
import DeviceFirmwareTab from '../components/firmware/DeviceFirmwareTab';
import DeviceSSHTab from '../components/ssh/DeviceSSHTab';
import DeviceRS232Tab from '../components/rs232/DeviceRS232Tab';
import DeviceFilesTab from '../components/files/DevicesFilesTab';
import FormError from '../components/common/FormError';
import ConfirmDialog from '../components/common/ConfirmDialog';

const DeviceDetailPage = () => {
  const { hostname } = useParams<{ hostname: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DeviceTab>('info');
  const [confirmingPowerOff, setConfirmingPowerOff] = useState(false);

  const { data: device, isLoading, error } = useGetDeviceQuery(hostname!, {
    skip: !hostname,
    pollingInterval: 10000,
  });

  const control = useDeviceControl(device);

  const handlePowerOffClick = () => {
    setConfirmingPowerOff(true);
  };
  const confirmPowerOff = () => {
    setConfirmingPowerOff(false);
    control.powerOff();
  };
  const cancelPowerOff = () => setConfirmingPowerOff(false);

  if (!hostname) {
    return (
      <div style={{ padding: '36px 120px' }}>
        <p className="text-[14px] text-[#DC2626]">Hostname не указан</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '36px 120px' }}>
        <div className="flex items-center justify-center py-16 text-[#6B7280] text-[14px]">
          Загрузка устройства...
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div style={{ padding: '36px 120px' }}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-[14px] text-[#DC2626]">
            Устройство «{hostname}» не найдено
          </p>
          <button
            onClick={() => navigate('/')}
            className="border border-[#D1D5DB] bg-transparent text-[#6B7280] rounded-[14px] px-6 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-gray-50"
          >
            Назад к списку
          </button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'info':
        return <DeviceInfoTab device={device} />;
      case 'firmware':
        return <DeviceFirmwareTab hostname={device.hostname} />;
      case 'ssh':
        return <DeviceSSHTab hostname={device.hostname} />;
      case 'rs232':
        return <DeviceRS232Tab hostname={device.hostname} />;
      case 'files':
        return <DeviceFilesTab hostname={device.hostname} />;
    }
  };

  return (
    <div style={{ padding: '36px 120px', margin: '0 auto' }}>
      <DeviceHeader
        device={device}
        onReload={control.reload}
        onPowerOff={handlePowerOffClick}
        onPowerOn={control.powerOn}
        isReloading={control.isReloading}
        isPowerToggling={control.isPowerToggling}
        canTogglePower={control.canTogglePower}
        isPoweredOff={control.isPoweredOff}
      />
      {control.error && (
        <div className="mb-4">
          <FormError message={control.error} />
        </div>
      )}
      <DeviceTabs activeTab={activeTab} onChange={setActiveTab} />
      {renderTab()}

      <ConfirmDialog
        open={confirmingPowerOff}
        title="Отключить устройство?"
        message={`Питание «${device.hostname}» будет снято через реле. Устройство станет недоступно до повторного включения.`}
        confirmLabel="Отключить"
        cancelLabel="Отмена"
        variant="danger"
        onConfirm={confirmPowerOff}
        onCancel={cancelPowerOff}
      />
    </div>
  );
};

export default DeviceDetailPage;
