const CommaNumberSpan = ({
  value,
  onlyNumber,
  isPercentage,
}: {
  value: number | undefined | null;
  onlyNumber?: boolean;
  isPercentage?: boolean;
}) => {
  const amount = value ?? 0;
  const style =
    amount >= 0 ? undefined : { color: "var(--ant-color-error-text)" };

  if (!value) return <span>-</span>;

  if (onlyNumber) {
    return (
      <span style={style}>
        {Math.round(amount).toLocaleString()}
        {isPercentage && <span>%</span>}
      </span>
    );
  }

  return (
    <span style={style}>
      {Math.round(amount).toLocaleString()}
      {isPercentage && <span>%</span>}
    </span>
  );
};

export default CommaNumberSpan;
