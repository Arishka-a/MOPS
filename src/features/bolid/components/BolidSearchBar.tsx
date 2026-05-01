interface Props {
  value: string;
  onChange: (value: string) => void;
}

const BolidSearchBar = ({ value, onChange }: Props) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Поиск по имени контроллера..."
      className="w-full border border-[#D1D5DB] rounded-[20px] px-6 py-4 text-[14px] bg-white outline-none mb-5"
    />
  );
};

export default BolidSearchBar;
