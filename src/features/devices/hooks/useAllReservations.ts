import { useMemo, useState } from 'react';
import {
  useGetReservationsQuery,
  useDeleteReservationByIdMutation,
} from '../api';
import { errMessage } from '../utils/errMessage';

export const useAllReservations = (open: boolean) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const {
    data: reservations,
    isLoading,
    isError,
    refetch,
  } = useGetReservationsQuery(undefined, { skip: !open });

  const [deleteById] = useDeleteReservationByIdMutation();

  const sorted = useMemo(() => {
    if (!reservations) return [];
    const toMs = (v: string | null): number =>
      v ? new Date(v).getTime() : Number.POSITIVE_INFINITY;
    return [...reservations].sort(
      (a, b) => toMs(a.time_start) - toMs(b.time_start),
    );
  }, [reservations]);

  const handleDelete = async (id: string) => {
    setError('');
    setDeletingId(id);
    try {
      await deleteById(id).unwrap();
    } catch (e) {
      setError(`Не удалось снять бронь: ${errMessage(e)}`);
    } finally {
      setDeletingId(null);
    }
  };

  return {
    sorted,
    isLoading,
    isError,
    refetch,
    error,
    deletingId,
    handleDelete,
  };
};
