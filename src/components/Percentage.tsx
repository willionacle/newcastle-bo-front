const Percentage = ({
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

  if (!value) return <div>-</div>;

  if (onlyNumber) {
    return <div style={style}>{Math.round(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0})}{suffix}</div>;
  }

  return <div style={style}>{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}{suffix}</div>;
};

export default Percentage;
