import AllReservationsList from './AllReservationsList';
import ReservationSearchCard from './reservations/ReservationSearchCard';

const ReservationPanel = () => {
  return (
    <div className="mt-5">
      <h2 className="text-[22px] font-extrabold mb-5">Бронь</h2>

      <div className="flex gap-5 flex-wrap">
        <div className="flex-1 min-w-[300px] flex flex-col gap-5">
          <ReservationSearchCard kind="by_id" />
          <ReservationSearchCard kind="by_hostname" />
        </div>
      </div>

      <AllReservationsList />
    </div>
  );
};

export default ReservationPanel;
