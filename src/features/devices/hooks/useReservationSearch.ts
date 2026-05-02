import { useState } from 'react';
import type { ReservationSchema } from '../types';

type LazyTrigger = (arg: string) => { unwrap: () => Promise<ReservationSchema> };
type MutationResult = { isLoading: boolean };
type DeleteTrigger = (arg: string) => { unwrap: () => Promise<unknown> };

interface Args {
  triggerSearch: LazyTrigger;
  triggerDelete: DeleteTrigger;
  deleteState: MutationResult;
}

export const useReservationSearch = ({
  triggerSearch,
  triggerDelete,
  deleteState,
}: Args) => {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<ReservationSchema | null>(null);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setError('');
    setFound(null);
    try {
      const result = await triggerSearch(query.trim()).unwrap();
      setFound(result);
    } catch {
      setError('Бронирование не найдено');
    }
  };

  const remove = async () => {
    if (!query.trim()) return;
    try {
      await triggerDelete(query.trim()).unwrap();
      setFound(null);
      setQuery('');
    } catch {
      setError('Ошибка при снятии');
    }
  };

  return {
    query,
    setQuery,
    found,
    error,
    isDeleting: deleteState.isLoading,
    search,
    remove,
  };
};
