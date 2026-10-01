

export default function LastMonthRate({value}:{value?: React.ReactNode}) {

  return value && (
    <span style={{ 
      color: 'var(--ant-color-info-text)', 
    }}>
      ({value})
    </span>
  )
}