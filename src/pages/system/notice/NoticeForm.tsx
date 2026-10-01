import i18next from "@/i18n/i18n";
import { Divider, Form, Image, Input, notification } from "antd";
import { useTranslation } from "react-i18next";
import SaveBtn from "@/components/SaveBtn";
import useEditor from "@/hooks/editor/Editor";
import { useEffect } from "react";
import { GF } from "@/utils/GlobalFunctions";
import CustomUpload from "@/components/CustomUpload";
import { PostGetNoticeRes } from "@/api/types";
import useUserStore from "@/store/user.store";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/axios";

interface Props {
  data?: PostGetNoticeRes['data'],
  content?: object;
}

interface FormData {
  "userid"    : number;
  "title"     : string;
  "content"   : string;
  "image"     : string;
}


const NoticeForm = ({ data, content }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const { el, value } = useEditor(content);
  const {token, userid} = useUserStore.getState()
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    const {  title, image } = e;

    const reqBody = {
      "userid"    : userid,
      "image"     : image ? image : '[]',
      "title"     : title,
      "content"   : value,
    }


    if (data) {
      const res = await api.updateNotice({
        ...reqBody, id: data.id}, token)
      const {data: {code, message}} = res
      console.log(res)
      if (code == 0) {
        notification.success({message: message})
        navigate("/system/notice");
      } else {
        notification.error({message: message})
      }
    } else {
      const res = await api.createNotice(reqBody, token)
      const {data: {code, message}} = res
      console.log(res)
      if (code == 0) {
        notification.success({message: message})
        navigate("/system/notice");
      } else {
        notification.error({message: message})
      }
    }
  };

  useEffect(() => {
    console.log(data)
    if (data) {
      const { title, image } = data;
      form.setFieldsValue({
        title,
        // content: JSON.parse(value),
        image
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item
        label={t("bannerDetail.bnr006")}
        rules={[{ required: true }]}
        name={"title"}
      >
        <Input />
      </Form.Item>

      <Divider />
      {data && (
          <Image
            src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.image)}`}
            preview={false}
          />
      )}

      <Form.Item
          label={i18next.t("col.image")}
          name={"image"}
        >
          <CustomUpload type={'image'}/>
      </Form.Item>

      {el}
      <SaveBtn />
    </Form>
  );
};

export default NoticeForm;
