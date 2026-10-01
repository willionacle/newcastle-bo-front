const CommaNumber2 = ({
  value,
  onlyNumber,
  maximumFractionDigits = 2,
  minimumFractionDigits = 2
}: {
  value: number | undefined | null;
  onlyNumber?: boolean;
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}) => {
  const amount = value ?? 0;
  const style =
    amount >= 0 ? undefined : { color: "var(--ant-color-error-text)" };

  if (!value) return <div>-</div>;

  if (onlyNumber) {
    return <div style={style}>{Math.round(amount).toLocaleString()}</div>;
  }

  return <div style={style}>{amount.toLocaleString(undefined, {minimumFractionDigits, maximumFractionDigits})}</div>;
};

export default CommaNumber2;
