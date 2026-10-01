import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { EventItem } from "@/api/stream-community-event/get";
// import CustomUpload from "@/components/CustomUpload";
import DateRange, { DateRangeType } from "@/components/DateRange";
import MatchSelect from "@/components/MatchSelect";
import SaveBtn from "@/components/SaveBtn";
import useEditor from "@/hooks/editor/Editor";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import {
  Divider,
  Form,
  // Image,
  Input,
  // Space,
  Switch,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormData {
  dateRange: DateRangeType;
  match_id: number;
  title: string;
  contents: string;
  is_visible: 1 | 0;
}

interface Props {
  data?: EventItem | null;
}

const StreamEventForm = ({ data }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const { el, value } = useEditor(data ? JSON.parse(data?.Contents) : undefined);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    const { token } = useUserStore.getState();
    console.log(e);
    const { dateRange, title,is_visible,match_id } = e;
    const [start, end] = dateRange;

    const reqBody = {
      start_date: GF.formatDate(start?.toISOString(), false),
      end_date: GF.formatDate(end?.toISOString(), false),
      title: title,
      contents:value,
      is_visible: is_visible ? 1 : 0,
      match_id: match_id,
    };

    try {
      if (data) {
        const res = await api.updateScEvent(
          {
            ...reqBody,
          },
          token
        );
        const {
          data: { code, message },
        } = res;
        console.log(res);
        if (code == 0) {
          notification.success({ message: message });
          navigate("/stream/events");
        } else {
          notification.error({ message: message });
        }
      } else {
        const res = await api.createScEvent(reqBody, token);
        const {
          data: { code, message },
        } = res;
        console.log(res);
        if (code == 0) {
          notification.success({ message: message });
          navigate("/stream/events");
        } else {
          notification.error({ message: message });
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
      const { EndDate, StartDate, Title,IsVisible,MatchID } =
        data;
      console.log(data);
      form.setFieldsValue({
        dateRange: [dayjs(EndDate).tz(), dayjs(StartDate).tz()],
        title:Title,
        is_visible: IsVisible ? 1 : 0,
        match_id:MatchID
      });
    }
  }, [data]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <MatchSelect disabled={data ? true: false}/>

      <DateRange />

      <Form.Item
        label={t("bannerDetail.bnr006")}
        name={"title"}
        rules={[{ required: true }]}
      >
        <Input type="text" size="small" />
      </Form.Item>

      <Form.Item
        label={t("messageDetail.msgr008")}
        name={"contents"}
        rules={[{ required: !value }]}
      >
        {el}
      </Form.Item>

      <Form.Item
        label={t("col.exposure")}
        name={"is_visible"}
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

export default StreamEventForm;
