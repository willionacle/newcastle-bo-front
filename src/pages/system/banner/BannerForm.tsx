import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { PostGetBannerRes } from "@/api/types";
import CustomUpload from "@/components/CustomUpload";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import { Divider, Form, Image, Input, notification, Select, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormData {
  dateRange: DateRangeType;
  url: string;
  in_use: boolean;
  x: number;
  y: number;
  order: number;
  "userid"        : number;
  "image"         : string;
  "thumbnail"     : string;
  "domain"     : string;
}

interface Props {
  data?: PostGetBannerRes['data'];
}

const BannerForm = ({ data }: Props) => {
  const { t } = useTranslation();
  const {token, userid} = useUserStore.getState()
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    const { dateRange, in_use, url, order, x, y, image, thumbnail, domain } = e;
    const [start, end] = dateRange;

    const reqBody = {
      "userid"        : userid,
      "start_date"    : GF.formatDate(start?.toISOString(), false),
      "end_date"      : GF.formatDate(end?.toISOString(), false),
      "image"         : image ? image : '-',
      "in_use"        : in_use ? 1 : 0,
      "order"         : Number(order),
      "x"             : x,
      "y"             : y,
      "url"           : url,
      "thumbnail"     : thumbnail ? thumbnail : '-',
      "domain"      : domain,
    }

    if (data) {
      const res = await api.updateBanner({
        ...reqBody, id: data.id}, token)
      const {data: {code, message}} = res
      console.log(res)
      if (code == 0) {
        notification.success({message: message})
        navigate("/system/banner");
      } else {
        notification.error({message: message})
      }
    } else {
      const res = await api.createBanner(reqBody, token)
      const {data: {code, message}} = res
      console.log(res)
      if (code == 0) {
        notification.success({message: message})
        navigate("/system/banner");
      } else {
        notification.error({message: message})
      }
    }

  };

  useEffect(() => {
    if (data) {
      const { end_date, start_date, url, in_use, x, y, order, thumbnail, image, domain } = data;

      form.setFieldsValue({
        dateRange: [dayjs(start_date).tz(), dayjs(end_date).tz()],
        url,
        in_use,
        x,
        y,
        order,
        thumbnail,
        image,
        domain,
      });
    }
  }, [data]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {data && (
        <Image
          src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.thumbnail)}`}
          preview={false}
        />
      )}

      <Form.Item
          label={i18next.t("col.image")}
          name={"thumbnail"}
        >
          <CustomUpload type={'thumbnail'}/>
      </Form.Item>

      <Form.Item
        name={"domain"}
        label={i18next.t("system.selectDomain")}
        rules={[{ required: true }]}
        initialValue={"both"}
      >
        <Select>
          <Select.Option value="sta">
            {"STA"}
          </Select.Option>
          <Select.Option value="evn">
            {"EVN"}
          </Select.Option>
          <Select.Option value="shared">
            {i18next.t("status.common")}
          </Select.Option>
        </Select>
      </Form.Item>

      <DateRange />

      <Form.Item
        label={t("bannerDetail.bnr004")}
        name={"url"}
        // rules={[{ required: true }]}
      >
        <Input size="small" />
      </Form.Item>

      <Form.Item
        label={t("bannerDetail.bnr007")}
        name={"order"}
        rules={[{ required: true }]}
      >
        <Input size="small" type="number" />
      </Form.Item>

      <Form.Item label={t("x")} name={"x"} rules={[{ required: true }]}>
        <Input size="small" type="number" />
      </Form.Item>

      <Form.Item label={t("y")} name={"y"} rules={[{ required: true }]}>
        <Input size="small" type="number" />
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

export default BannerForm;
