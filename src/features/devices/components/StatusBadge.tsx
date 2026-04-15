interface StatusBadgeProps {
  text: string;
  color: 'green' | 'red' | 'orange' | 'blue' | 'gray';
}

const styles: Record<string, { bg: string; text: string; dot: string }> = {
  green: { bg: 'rgba(22,163,74,0.09)', text: '#16A34A', dot: '#16A34A' },
  red: { bg: 'rgba(220,38,38,0.09)', text: '#DC2626', dot: '#DC2626' },
  orange: { bg: 'rgba(234,88,12,0.09)', text: '#EA580C', dot: '#EA580C' },
  blue: { bg: 'rgba(38,38,224,0.09)', text: '#2626E0', dot: '#2626E0' },
  gray: { bg: 'rgba(107,114,128,0.09)', text: '#6B7280', dot: '#6B7280' },
};

const StatusBadge = ({ text, color }: StatusBadgeProps) => {
  const s = styles[color];
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center gap-[5px] px-3 py-[3px] rounded-[20px] text-[12px] font-semibold whitespace-nowrap"
    >
      <span
        style={{ background: s.dot }}
        className="w-[6px] h-[6px] rounded-full"
      />
      {text}
    </span>
  );
};

export default StatusBadge;