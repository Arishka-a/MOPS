import { useGetImageByDeviceQuery } from '../../api';
import { useInstallPolling } from '../../hooks/useInstallPolling';
import CurrentImageInfo from './CurrentImageInfo';
import LoadFromShareForm from './LoadFromShareForm';
import UploadImageForm from './UploadImageForm';
import LogsViewer from '../common/LogsViewer';

interface Props {
  hostname: string;
}

const DeviceFirmwareTab = ({ hostname }: Props) => {
  const { data: image, isLoading: imageLoading } = useGetImageByDeviceQuery(hostname);
  const { logs, isInstalling, isPolling, startInstall } = useInstallPolling(hostname);

  return (
    <div>
      <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7 mb-5">
        <h3 className="text-[18px] font-bold mb-5">Текущий образ</h3>

        {imageLoading ? (
          <p className="text-[14px] text-[#6B7280]">Загрузка...</p>
        ) : image ? (
          <CurrentImageInfo
            image={image}
            onInstall={startInstall}
            isInstalling={isInstalling || isPolling}
          />
        ) : (
          <p className="text-[14px] text-[#6B7280]">Образ не привязан к устройству</p>
        )}
      </div>

      <div className="flex gap-5 mb-5">
        <LoadFromShareForm hostname={hostname} />
        <UploadImageForm hostname={hostname} />
      </div>

      <LogsViewer logs={logs} />
    </div>
  );
};

export default DeviceFirmwareTab;
