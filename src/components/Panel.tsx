

import React from 'react'

interface Props {
    title?: string;
    children?: React.ReactNode;
}

const PanelStyle: React.CSSProperties = {
    border: 'solid 1px var(--ant-color-split)',
    borderRadius: 8,
    padding: '3rem 2rem 2rem',
    position: 'relative',
    marginBottom: '2rem'
}

const TitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-13px',
    left: '2rem',
    padding: '2px 6px',
    background: '#fff',
    fontWeight: 600,
    fontSize: 'small',
}

const Panel: React.FC<Props> = (props) => {
  return (
    <div style={PanelStyle}>
        <div style={TitleStyle}>{props.title}</div>
        {props.children}
    </div>
  )
}

export default Panel