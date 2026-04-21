import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetDeviceQuery,
  useReloadDeviceMutation,
  useControlBolidPinMutation,
} from '../api';
import DeviceHeader from '../components/DeviceHeader';
import DeviceTabs from '../components/DeviceTabs';
import type { DeviceTab } from '../components/DeviceTabs';
import DeviceInfoTab from '../components/DeviceInfoTab';
import DeviceFirmwareTab from '../components/DeviceFirmwareTab';
import DeviceSSHTab from '../components/DeviceSSHTab';
import DeviceRS232Tab from '../components/DeviceRS232Tab';
import DeviceFilesTab from '../components/DevicesFilesTab';

const DeviceDetailPage = () => {
  const { hostname } = useParams<{ hostname: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DeviceTab>('info');

  const { data: device, isLoading, error } = useGetDeviceQuery(hostname!, {
    skip: !hostname,
    pollingInterval: 10000,
  });

  const [reloadDevice, { isLoading: isReloading }] = useReloadDeviceMutation();
  const [controlPin, { isLoading: isPoweringOff }] = useControlBolidPinMutation();

  const handleReload = async () => {
    if (!device) return;
    try {
      await reloadDevice({
        hostname: device.hostname,
        ssh_username: 'root',
        retries: 3,
        retry_delay: 5,
      }).unwrap();
    } catch {
      // 
    }
  };

  const handlePowerOff = async () => {
    if (!device?.output_power) return;
    try {
      await controlPin({
        hostname: device.hostname,
        state: 0,
        bolid_name: device.output_power.bolid_name,
      }).unwrap();
    } catch {
      // 
    }
  };

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
        onReload={handleReload}
        onPowerOff={handlePowerOff}
        isReloading={isReloading}
        isPoweringOff={isPoweringOff}
      />
      <DeviceTabs activeTab={activeTab} onChange={setActiveTab} />
      {renderTab()}
    </div>
  );
};

export default DeviceDetailPage;
