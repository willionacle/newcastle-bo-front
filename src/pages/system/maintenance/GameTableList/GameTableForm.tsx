import i18next from "@/i18n/i18n";
import { createBetBlockAPI } from "@/api/bet-block/post";
import { updateBetBlockAPI } from "@/api/bet-block/put";
import { BetBlockData, BetBlockBody } from "@/api/bet-block/types";
import CustomUpload from "@/components/CustomUpload";
import SaveBtn from "@/components/SaveBtn";
import { GF } from "@/utils/GlobalFunctions";
import {
  Divider,
  Form,
  Image,
  Input,
  Space,
  notification,
} from "antd";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data?: BetBlockData;
  close: () => void;
}

const GameTableForm = ({ data, close }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<BetBlockBody>();
  console.log(data)
  const initialValues = useMemo(() => {
    if (!data?.id) return undefined;

    const { created_at, updated_at, is_blocked, name, ...rest} = data;
    return {...rest, game_name: name};
  }, [data])

  const handleSubmit = async (e: BetBlockBody) => {

    try {
      if (data?.id) {

        const res = await updateBetBlockAPI({
          ...e,
          id: data.id,
          game_image: e.game_image || data.game_image,
        })
        const {data: {code, message}} = res
        
        if (code == 0) {
          notification.success({message: message})
          close();
        } else {
          notification.error({message: message})
        }
      } else {
        if (!data?.vendor_id) {
          notification.error({
            message: "Vendor ID is missing",
          });
          return;
        }
        
        const res = await createBetBlockAPI({
          ...e,
          vendor_id: data?.vendor_id,
        })
        const {data: {code, message}} = res

        if (code == 0) {
          notification.success({message: message})
          close();
        } else {
          notification.error({message: message})
        }
      }
    } catch (error: any) {
      notification.error({
        message: error.response.data.error.message ?? i18next.t("toast.common.saveFailed"),
      });
    }
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    }
  }, [])

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      {data && (
        <div style={{ display: "flex", gap: "1rem", marginBlock: "1rem" }}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <p>{i18next.t("col.image")}</p>
            <Image
              src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.game_image)}`}
              preview={false}
              wrapperStyle={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      <Space>
        <div>
          <Form.Item
            label={i18next.t("col.image")}
            name={"game_image"}
          >
            <CustomUpload type={"game_image"}/>
          </Form.Item>
        </div>
      </Space>

      <Form.Item
        label={t("col.tableId")}
        name={"table_id"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("col.virtualTableId")}
        name={"virtual_table_id"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("col.gameType")}
        name={"game_type"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("col.gameName")}
        name={"game_name"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      {/* <Form.Item
        label={t("col.blocked")}
        name={"is_blocked"}
        rules={[{ required: true }]}
        initialValue={true}
      >
        <Switch />
      </Form.Item> */}

      <Divider />

      <SaveBtn />
    </Form>
  );
};

export default GameTableForm;
