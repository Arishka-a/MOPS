const DevicesTableHead = () => {
  const headers = [
    'Hostname', 'Тип', 'IP-адрес', 'MAC-адрес',
    'Подключение', 'Стадия', 'Бронь',
  ];

  return (
    <thead>
      <tr className="border-b border-gray-200">
        {headers.map((h) => (
          <th key={h} className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">
            {h}
          </th>
        ))}
        <th className="text-right py-3 px-4"></th>
      </tr>
    </thead>
  );
};

export default DevicesTableHead;