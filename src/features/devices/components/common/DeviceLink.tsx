import { useNavigate } from 'react-router-dom';

interface Props {
  hostname: string | null | undefined;
  fromPath?: string;
}

const DeviceLink = ({ hostname, fromPath }: Props) => {
  const navigate = useNavigate();

  if (!hostname) {
    return <span className="text-[#6B7280]">—</span>;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(`/devices/${hostname}`, fromPath ? { state: { from: fromPath } } : undefined)}
      className="text-[#2626E0] font-semibold cursor-pointer hover:underline bg-transparent border-none p-0"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {hostname}
    </button>
  );
};

export default DeviceLink;
