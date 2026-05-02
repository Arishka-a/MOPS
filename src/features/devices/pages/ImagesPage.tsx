import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ImagesTable from '../components/firmware/ImagesTable';
import CleanupStatsBanner from '../components/firmware/CleanupStatsBanner';
import { useImagesPage } from '../hooks/useImagesPage';

const ImagesPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useImagesPage();

  return (
    <div style={{ padding: '36px 120px', margin: '0 auto' }}>
      <AppHeader
        title={
          <span className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-transparent border-none text-[24px] cursor-pointer text-[#1F2937] hover:text-[#2626E0] transition-colors"
              aria-label="Назад к устройствам"
            >
              ←
            </button>
            Образы
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => setConfirmCleanup(true)}
            disabled={isCleaning}
            className="bg-[#FEE2E2] text-[#DC2626] border-none rounded-[14px] px-5 py-[10px] text-[14px] font-bold cursor-pointer hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCleaning ? 'Очистка...' : 'Очистить'}
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-[#DC2626]">
          {error}
        </div>
      )}

      {cleanupStats && <CleanupStatsBanner stats={cleanupStats} />}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Образов на сервере нет
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-3 text-[#2626E0] underline cursor-pointer bg-transparent border-none"
          >
            обновить
          </button>
        </div>
      ) : (
        <ImagesTable
          images={images}
          isDeleting={isDeleting}
          onDeleteRequest={setConfirmDeleteId}
        />
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Удалить образ?"
        message="Файл образа будет удалён с сервера. Это действие необратимо."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="danger"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmDialog
        open={confirmCleanup}
        title="Запустить очистку?"
        message="Будут удалены файлы образов без записей в БД и записи в БД без соответствующих файлов. Действие необратимо."
        confirmLabel="Очистить"
        cancelLabel="Отмена"
        variant="danger"
        onConfirm={handleCleanup}
        onCancel={() => setConfirmCleanup(false)}
      />
    </div>
  );
};

export default ImagesPage;
