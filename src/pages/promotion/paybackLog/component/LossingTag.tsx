import i18next from "@/i18n/i18n";
import { Tag, TagProps } from 'antd';
import { CSSProperties} from 'react';
import { PaybackListData } from '@/api/payback-logs/get';

interface Props {
  status: PaybackListData['status'];
}

const tagStyle: CSSProperties = {
  minWidth: 44, 
  textAlign: 'center',
  cursor: 'pointer'
}

const LossingStatusTag = ({status}: Props) => {
  
  const handleTagProps = () => {
    const tagProps: TagProps = {
      color: "",
      children: ""
    }
    switch (status) {
      case 2:
        tagProps.color = "success";
        tagProps.children = i18next.t("moneyType.pay");
        break;
      case 1:
        tagProps.color = "warning";
        tagProps.children = i18next.t("moneyType.unpaid");
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
      <Tag {...handleTagProps()} style={tagStyle} />
    </>
  )
}

export default LossingStatusTag;