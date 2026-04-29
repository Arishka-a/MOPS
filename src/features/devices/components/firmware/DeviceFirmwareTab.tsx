import { useEffect, useState } from 'react';
import {
  useGetDeviceQuery,
  useGetImageByDeviceQuery,
  useDeleteImageByHostnameMutation,
} from '../../api';
import { useInstallPolling } from '../../hooks/useInstallPolling';
import { clearPendingInstall } from '../../hooks/imageBindingPersist';
import { errMessage } from '../../utils/errMessage';
import type { DeviceSchema, ImageSchema } from '../../types';
import CurrentImageInfo from './CurrentImageInfo';
import ImageStatusBadge from './ImageStatusBadge';
import LoadFromShareForm from './LoadFromShareForm';
import UploadImageForm from './UploadImageForm';
import LogsViewer from '../common/LogsViewer';

interface Props {
  hostname: string;
}

const DeviceFirmwareTab = ({ hostname }: Props) => {
  const { data: deviceData } = useGetDeviceQuery(hostname);
  const device = deviceData as DeviceSchema | undefined;
  const {
    data,
    isLoading: imageLoading,
    refetch: refetchImage,
  } = useGetImageByDeviceQuery(hostname);
  const fetchedImage = data as ImageSchema | undefined;
  const { logs, stage, stageLabel, isActive, startInstall, reset } = useInstallPolling(hostname);
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageByHostnameMutation();
  const [deleteError, setDeleteError] = useState('');

  const [optimisticDeleted, setOptimisticDeleted] = useState(false);
  useEffect(() => {
    setOptimisticDeleted(false);
  }, [hostname]);
  useEffect(() => {
    if (!fetchedImage) setOptimisticDeleted(false);
  }, [fetchedImage]);

  const image = optimisticDeleted ? undefined : fetchedImage;

  const handleDelete = async () => {
    setDeleteError('');
    try {
      await deleteImage(hostname).unwrap();
      setOptimisticDeleted(true);
      clearPendingInstall(hostname);
      reset();
      void refetchImage();
    } catch (e) {
      setDeleteError(errMessage(e));
    }
  };

  return (
    <div>
      <div className="rounded-[20px] border border-[#D1D5DB] bg-white p-7 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-[18px] font-bold">Текущий образ</h3>
          <ImageStatusBadge
            hostname={hostname}
            image={image ?? null}
            testStage={device?.test_stage ?? null}
            isInstalling={isActive}
          />
        </div>

        {imageLoading ? (
          <p className="text-[14px] text-[#6B7280]">Загрузка...</p>
        ) : image ? (
          <CurrentImageInfo
            image={image}
            onInstall={startInstall}
            isInstalling={isActive}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ) : (
          <p className="text-[14px] text-[#6B7280]">Образ не привязан к устройству</p>
        )}

        {deleteError && (
          <p className="mt-4 text-[14px] text-[#DC2626]">Ошибка удаления: {deleteError}</p>
        )}

        {isActive && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2626E0] animate-pulse" />
            <span className="text-[14px] font-semibold text-[#2626E0]">{stageLabel}</span>
          </div>
        )}
        {stage === 'done' && (
          <p className="mt-4 text-[14px] font-semibold text-[#16A34A]">Установка полностью завершена</p>
        )}
        {stage === 'error' && (
          <p className="mt-4 text-[14px] font-semibold text-[#DC2626]">Ошибка при установке</p>
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
