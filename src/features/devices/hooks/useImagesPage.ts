import { useState } from 'react';
import {
  useGetAllImagesQuery,
  useDeleteImageByIdMutation,
  useCleanupImagesMutation,
} from '../api';
import type { ImageCleanupStats } from '../types';
import { errMessage } from '../utils/errMessage';

export const useImagesPage = () => {
  const { data: images = [], isLoading, refetch } = useGetAllImagesQuery();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageByIdMutation();
  const [cleanup, { isLoading: isCleaning }] = useCleanupImagesMutation();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmCleanup, setConfirmCleanup] = useState(false);
  const [error, setError] = useState('');
  const [cleanupStats, setCleanupStats] = useState<ImageCleanupStats | null>(null);

  const handleDelete = async (imageId: string) => {
    setError('');
    try {
      await deleteImage(imageId).unwrap();
      setConfirmDeleteId(null);
    } catch (e) {
      setError(`Не удалось удалить образ: ${errMessage(e)}`);
    }
  };

  const handleCleanup = async () => {
    setError('');
    setCleanupStats(null);
    try {
      const response = await cleanup().unwrap();
      setCleanupStats(response.statistics);
      setConfirmCleanup(false);
    } catch (e) {
      setError(`Не удалось выполнить очистку: ${errMessage(e)}`);
    }
  };

  return {
    images,
    isLoading,
    refetch,
    isDeleting,
    isCleaning,
    error,
    cleanupStats,
    confirmDeleteId,
    confirmCleanup,
    setConfirmDeleteId,
    setConfirmCleanup,
    handleDelete,
    handleCleanup,
  };
};
