const PercentageColored = ({
  value,
  onlyNumber,
  enclosed
}: {
  value: number | undefined | null;
  onlyNumber?: boolean;
  enclosed?: boolean
}) => {
  const amount = value ?? 0;
  const style =
    amount >= 0 ? { color: "var(--ant-color-info-text)" } : { color: "var(--ant-color-error-text)" };

  if (!value) return <div>-</div>;

  if (onlyNumber) {
    return <div style={style}>{enclosed && '('}{Math.round(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0})}%{enclosed && ')'}</div>;
  }

  return <div style={style}>{enclosed && '('}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}%{enclosed && ')'}</div>;
};

export default PercentageColored;
