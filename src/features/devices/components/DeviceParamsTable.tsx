interface Param {
  readonly label: string;
  readonly value: string | number;
}

interface Props {
  params: readonly Param[];
}

const DeviceParamsTable = ({ params }: Props) => {
  return (
    <table className="w-full border-collapse text-[14px]">
      <tbody>
        {params.map((p, idx) => (
          <tr key={idx} className="border-b border-[#E5E7EB]">
            <td className="py-3 px-4 text-[#6B7280] font-medium w-[200px]">{p.label}</td>
            <td
              className="py-3 px-4 font-semibold text-right"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {p.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DeviceParamsTable;
