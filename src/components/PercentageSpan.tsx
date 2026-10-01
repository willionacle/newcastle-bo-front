const PercentageSpan = ({
  value,
  onlyNumber,
  suffix = "%",
}: {
  value: number | undefined | null;
  onlyNumber?: boolean;
  suffix?: string;
}) => {
  const amount = value ?? 0;
  const style =
    amount >= 0 ? undefined : { color: "var(--ant-color-error-text)" };

  if (!value) return <span>-</span>;

  if (onlyNumber) {
    return <span style={style}>{Math.round(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0})}{suffix}</span>;
  }

  return <span style={style}>{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}{suffix}</span>;
};

export default PercentageSpan;
