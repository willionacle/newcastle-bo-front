import { GF } from '@/utils/GlobalFunctions';
import React, { useState } from 'react'

interface Props {
    data: string;
}

const WalletAddress: React.FC<Props> = ({data}) => {
  const [expand, setExpand] = useState(false);

  if (!data || data == '-') return <div className="">-</div>;

  return (
    <div 
      style={{
        position: 'relative'
      }}
    >
      <div 
        className=""
        style={{
          // display: !expand ? 'block' : 'none',
          cursor: 'pointer'
        }}
        onClick={() => data ? setExpand(!expand) : undefined}
      >
        {data ? GF.trimWalletAddress(data, 3, 4) : ""}
      </div>
      <div 
        className=""
        style={{
          display: expand ? "block" : "none",
          position: 'absolute',
          backgroundColor: '#ff',
          boxShadow: '#00000045 0px 0px 4px',
          cursor: 'pointer',
          textWrap: 'nowrap',
          lineHeight: 1,
          padding: '4px',
          borderRadius: '4px',
          zIndex: '1',
          top: '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {data}
      </div>
    </div>
  )
}

export default WalletAddress