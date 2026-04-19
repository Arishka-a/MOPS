const DevicesTableHead = () => {
  const headers = [
    'Hostname', 'Тип', 'IP-адрес', 'MAC-адрес',
    'Подключение', 'Стадия', 'Активно', 'Бронь',
  ];

  return (
    <thead>
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            className="text-left px-[14px] py-[10px] bg-[#F3F4F6] font-bold text-[11px] uppercase tracking-[0.5px] text-[#6B7280] border-b border-[#D1D5DB] whitespace-nowrap"
          >
            {h}
          </th>
        ))}
        <th className="bg-[#F3F4F6] border-b border-[#D1D5DB]"></th>
      </tr>
    </thead>
  );
};

export default DevicesTableHead;