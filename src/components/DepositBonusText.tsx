

const DepositBonusText = ({value}: {value?: string}) => {

  return (
    <div 
      style={{
        maxWidth: 67,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textAlign: "center",
        margin: "0 auto",
      }}
    >
      {value ?? "-"}
    </div>
  )
}

export default DepositBonusText;