import i18next from "@/i18n/i18n";
import { GameMaintenanceData } from '@/api/game-maintenances/get'
import { updateGameImage, UpdateGameImageBody } from '@/api/game-maintenances/put'
import CustomUploadPreview from '@/components/CustomUploadPreview';
import { GF } from '@/utils/GlobalFunctions';
import { Col, notification, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
  record: GameMaintenanceData;
  index: number;
  mutate: any;
}

const GameImageUploadPreview = ({value, record, index, mutate}: Props) => {
  const { t } = useTranslation();

  const cusomImgRegex = /^\["[^"]+\.(png|jpg)"\]$/;
  const imgPC = cusomImgRegex.test(value) ? `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}` : value;
  const imgMobile = cusomImgRegex.test(record.game_image_mobile) ? `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(record.game_image_mobile)}` : record.game_image_mobile ?? "";
  const fileListPC = value ? [
    {
      uid: String(index),
      name: imgPC,
      url: imgPC
    }
  ] : [];
  const fileListMobile = record.game_image_mobile ? [
    {
      uid: String(index),
      name: imgMobile,
      url: imgMobile
    }
  ] : [];

  const handleGameUpdate = async (record: GameMaintenanceData, fileName?: string, newDisplayOrder?: string, forMobile?: boolean) => {
    try {
      const {id, game_image, game_image_mobile } = record;
      const reqBody: UpdateGameImageBody = {
        id,
        game_image: forMobile || newDisplayOrder ? game_image :  fileName,
        game_image_mobile: forMobile ? fileName ?? game_image_mobile : game_image_mobile ?? "",
      }
      const res = await updateGameImage(reqBody);
      console.log(res)
      const { data: { code }} = res
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.error({
          message: t("global.fail"),
          duration: 1,
          type: "success",
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row gutter={[16, 16]} style={{paddingTop: 10, paddingBottom: 10}}>
      <Col span={12}>
          <Typography.Text strong>{i18next.t("col.desktopImage")}</Typography.Text>
          <CustomUploadPreview fileList={fileListPC} handleCustomUpload={(fileName) => handleGameUpdate(record, fileName)} />
      </Col>
      <Col span={12} style={{borderLeft: '1px solid var(--ant-color-border-secondary)'}}>
          <Typography.Text strong>{i18next.t("col.mobileImage")}</Typography.Text>
          <CustomUploadPreview fileList={fileListMobile} handleCustomUpload={(fileName) => handleGameUpdate(record, fileName, undefined, true)} />
      </Col>
    </Row>
  )
}

export default GameImageUploadPreview