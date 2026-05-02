import type { ImageCleanupStats } from '../../types';

interface Props {
  stats: ImageCleanupStats;
}

const CleanupStatsBanner = ({ stats }: Props) => {
  return (
    <div className="mb-4 rounded-[12px] border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-[#15803d]">
      Очистка выполнена: удалено файлов — {stats.files_deleted}, удалено
      записей в БД — {stats.db_records_deleted}, ошибок — {stats.errors}.
    </div>
  );
};

export default CleanupStatsBanner;
