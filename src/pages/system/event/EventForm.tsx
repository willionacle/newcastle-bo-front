import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { PostAPERes } from "@/api/types";
import CustomUpload from "@/components/CustomUpload";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import {
  Divider,
  Form,
  Image,
  Input,
  Space,
  Switch,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormData {
  dateRange: DateRangeType;
  url: string;
  in_use: boolean;
  title: string;
  order: number;
  image: string;
  thumbnail: string;
}

interface Props {
  data?: PostAPERes['data'];
}

const EventForm = ({ data }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    const {token, userid} = useUserStore.getState()
    console.log(e)
    const { dateRange, in_use, title, order, image, thumbnail } = e;
    const [start, end] = dateRange;


    const reqBody = {
      "userid"        : userid,
      "start_date"    : GF.formatDate(start?.toISOString(), false),
      "end_date"      : GF.formatDate(end?.toISOString(), false),
      "title"         : title,
      "image"         : image,
      "thumbnail"     : thumbnail,
      "in_use"        : in_use ? 1 : 0,
      "order"         : order,
    }

    try {
      if (data) {

        const res = await api.updateEvent({
          ...reqBody, id: data.id}, token)
        const {data: {code, message}} = res
        console.log(res)
        if (code == 0) {
          notification.success({message: message})
          navigate("/system/event");
        } else {
          notification.error({message: message})
        }
      } else {
        const res = await api.createEvent(reqBody, token)
        const {data: {code, message}} = res
        console.log(res)
        if (code == 0) {
          notification.success({message: message})
          navigate("/system/event");
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
    if (data) {
      const { end_date, start_date, title, order, in_use, image, thumbnail } = data;
      console.log(data)
      form.setFieldsValue({
        dateRange: [dayjs(start_date).tz(), dayjs(end_date).tz()],
        title,
        order,
        in_use,
        image,
        thumbnail
      });
    }
  }, [data]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {data && (
        <div style={{ display: "flex", gap: "1rem", marginBlock: "1rem" }}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <p>{i18next.t("col.image")}</p>
            <Image
              src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.image)}`}
              preview={false}
              wrapperStyle={{ width: "100%" }}
            />
          </div>

          <div style={{ flex: 1, maxWidth: "300px" }}>
            <p>{i18next.t("col.thumbnail")}</p>
            <Image
              src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.thumbnail)}`}
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
            name={"image"}
          >
            <CustomUpload type={'image'}/>
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label={i18next.t("col.thumbnail")}
            name={"thumbnail"}
          >
            <CustomUpload type={'thumbnail'}/>
          </Form.Item>
        </div>
      </Space>

      <DateRange />

      <Form.Item
        label={t("bannerDetail.bnr006")}
        name={"title"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("bannerDetail.bnr007")}
        name={"order"}
        rules={[{ required: true }]}
      >
        <Input type="number" size="small" />
      </Form.Item>

      <Form.Item
        label={t("col.exposure")}
        name={"in_use"}
        rules={[{ required: true }]}
        initialValue={true}
      >
        <Switch />
      </Form.Item>

      <Divider />

      <SaveBtn />
    </Form>
  );
};

export default EventForm;
