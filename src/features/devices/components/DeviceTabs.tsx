export type DeviceTab = 'info' | 'firmware' | 'ssh' | 'rs232' | 'files';

interface Props {
  activeTab: DeviceTab;
  onChange: (tab: DeviceTab) => void;
}

const tabs: { key: DeviceTab; label: string }[] = [
  { key: 'info', label: 'Информация' },
  { key: 'firmware', label: 'Прошивка' },
  { key: 'ssh', label: 'SSH' },
  { key: 'rs232', label: 'RS232' },
  { key: 'files', label: 'Файлы' },
];

const DeviceTabs = ({ activeTab, onChange }: Props) => {
  return (
    <div className="rounded-[20px] border border-[#D1D5DB] bg-white px-2 py-2 mb-6 inline-flex gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              rounded-[14px] px-6 py-[10px] text-[14px] font-bold border-none cursor-pointer transition-colors
              ${isActive
                ? 'bg-[#2626E0] text-white'
                : 'bg-transparent text-[#111] hover:bg-[#F3F4F6]'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default DeviceTabs;
