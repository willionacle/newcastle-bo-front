import i18next from "@/i18n/i18n";
import { MissionItemData } from '@/api/daily-mission/mission-events/get';
import React from 'react'

interface Props {
	data: MissionItemData | undefined;
	index: number;
}

const itemStyle: React.CSSProperties = {
	display: 'flex',
	// justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: 4,
	
}

const labelStyle: React.CSSProperties = {
	fontWeight: 'bold',
	minWidth: 120
}
const valueStyle: React.CSSProperties = {
	marginLeft: 'auto'
}

const MissionDetails = ({data, index}: Props) => {
  return (
    <div>
			<div className="" style={itemStyle}>
				<span style={labelStyle}>{i18next.t("mission.missionCount")}</span>
				<span>:</span>
				<span style={valueStyle}>미션 {index+1}</span>
			</div>
			<div className="" style={itemStyle}>
				<span style={labelStyle}>{i18next.t("mission.missionTitle")}</span>
				<span>:</span>
				<span style={valueStyle}>{data?.mission_name}</span>
			</div>
			<div className="" style={itemStyle}>
				<span style={labelStyle}>{i18next.t("event.missionType")}</span>
				<span>:</span>
				<span style={valueStyle}>{data?.mission_type}</span>
			</div>
			<div className="" style={itemStyle}>
				<span style={labelStyle}>{i18next.t("event.progress")}</span>
				<span>:</span>
				<span style={valueStyle}>{data?.amount} / {data?.target_amount}</span>
			</div>
		</div>
  )
}

export default MissionDetails