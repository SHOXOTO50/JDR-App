interface Props {
  value: number;
  max: number;
  className?: string;
}

export default function XPBar({ value, max, className }: Props) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={`xpbar ${className ?? ''}`}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
