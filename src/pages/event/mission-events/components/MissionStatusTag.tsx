import i18next from "@/i18n/i18n";
import { MissionEventsData, MissionItemData } from '@/api/daily-mission/mission-events/get'
import { Modal, ModalProps, notification, Tag, TagProps } from 'antd';
import { CSSProperties, MouseEvent, useState } from 'react';
import MissionDetails from './MissionDetails';
import { updateMissionProgressAPI } from '@/api/daily-mission/mission-events/put';
import { KeyedMutator } from 'swr';
import { SWRType } from '@/api/types';

interface Props {
  record: MissionItemData;
  index: number;
  rowData: MissionEventsData;
  mutate: KeyedMutator<SWRType<MissionEventsData[]>>;
}

const tagStyle: CSSProperties = {
  minWidth: 44, 
  textAlign: 'center',
  cursor: 'pointer'
}

const MissionStatusTag = ({record, index, mutate, rowData}: Props) => {
  const [missionOpen, setMissionOpen] = useState<boolean>(false);

  const handleMissionUpdate = async (type: number, e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // console.log(e.target.localName);
    // @ts-ignore
    if (e.target.localName === 'span') {
      try {
        const res = await updateMissionProgressAPI({id: record.id, status: type, username: rowData.username});
        const {code, message} = res.data;
  
        if (code === 0) {
          mutate();
          notification.success({message: message});
          setMissionOpen(false);
        } else {
          notification.error({message: message});
        }
      } catch (error) {
        
      }
    } else {
      setMissionOpen(false);
      return;
    }
  }

  const handleModalProps = () => {
    const modalProps: ModalProps = {}

    if (record.type === 1) {
      modalProps.onOk = () => setMissionOpen(false);
      modalProps.onCancel = () => setMissionOpen(false);
      modalProps.cancelButtonProps = { hidden: true };
      modalProps.closeIcon = false;
    } else {
      modalProps.onOk = (e) => handleMissionUpdate(1, e);
      modalProps.onCancel = (e) => handleMissionUpdate(0,e);
      modalProps.okText = i18next.t("mission.missionComplete");
      modalProps.cancelText = i18next.t("mission.missionCancel");
      // modalProps.maskClosable = true;
      modalProps.closeIcon = true;
    }

    return modalProps;
  }
  
  const handleTagProps = () => {
    const tagProps: TagProps = {
      color: "",
      children: ""
    }
    switch (record.status) {
      case 0:
        tagProps.color = "processing";
        tagProps.children = i18next.t("status.ongoing");
        break;
      case 1:
        tagProps.color = "success";
        tagProps.children = i18next.t("global.complete");
        break;
      case 2:
        tagProps.color = "warning";
        tagProps.children = i18next.t("status.request");
        break;
      case 3:
        tagProps.color = "error";
        tagProps.children = i18next.t("global.cancel");
        break;
      default:
        break;
    }

    return tagProps;
  };

  return (
    <>
      <Tag {...handleTagProps()} style={tagStyle} onClick={() => setMissionOpen(true)} />
      <Modal 
        {...handleModalProps()}
        open={missionOpen}
        width={'400px'}
        destroyOnClose
        centered
        title={i18next.t("title.missionDetails")}
      >
        <MissionDetails data={record} index={index} />
      </Modal>
    </>
  )
}

export default MissionStatusTag;