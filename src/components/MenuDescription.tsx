import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { CSSProperties } from 'react'

const markStyle: CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 9999,
  backgroundColor: 'var(--ant-color-bg-mask)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: 16
}

const MenuDescription = (
  {
    desc,
    style,
    placement = "topLeft"
  }: {
    desc: React.ReactNode,
    style?: CSSProperties,
    placement?: TooltipPlacement
  }
) => {
  return (
    <Tooltip 
      rootClassName='custom-ant-tooltip'
      title={desc} 
      color='color-mix(in srgb, var(--ant-color-primary), #fff 70%)'
      placement={placement} 
      style={{
        fontSize: 24
      }}
    >
      <div style={{...markStyle, ...style}}>?</div>
    </Tooltip>
  )
}

export default MenuDescription


