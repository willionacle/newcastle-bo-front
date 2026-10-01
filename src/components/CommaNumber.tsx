const CommaNumber = ({
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

  if (!value) return <div>-</div>;

  if (onlyNumber) {
    return (
      <div style={style}>
        {Math.round(amount).toLocaleString()}
        {isPercentage && <span>%</span>}
      </div>
    );
  }

  return (
    <div style={style}>
      {Math.round(amount).toLocaleString()}
      {isPercentage && <span>%</span>}
    </div>
  );
};

export default CommaNumber;
