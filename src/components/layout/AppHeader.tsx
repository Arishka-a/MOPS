import type { ReactNode } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { selectAuthUsername } from '../../features/auth/selectors';
import { useLogout } from '../../features/auth/useLogout';

interface Props {
  title: ReactNode;
  actions?: ReactNode;
}

const AppHeader = ({ title, actions }: Props) => {
  const username = useAppSelector(selectAuthUsername);
  const { logout, isLoading } = useLogout();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-[22px] font-extrabold">{title}</h2>

      <div className="flex gap-3 items-center">
        {actions}

        {username && (
          <span className="text-[13px] text-[#6B7280]">
            <span className="font-semibold text-[#1F2937]">{username}</span>
          </span>
        )}

        <button
          type="button"
          onClick={logout}
          disabled={isLoading}
          className="border border-[#D1D5DB] bg-transparent text-[#6B7280]
                     rounded-[14px] px-4 py-[8px] text-[13px] font-bold cursor-pointer
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isLoading ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
