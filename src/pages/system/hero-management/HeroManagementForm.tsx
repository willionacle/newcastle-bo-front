import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { PostGetHeroRes } from "@/api/types";
import CustomUpload from "@/components/CustomUpload";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import {
  Divider,
  Form,
  Image,
  Input,
  Select,
  Space,
  Switch,
  notification,
} from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  category: string | null;
  order: number;
  in_use: boolean;
  "imageMobile"   : string,
  "imageDesktop"  : string
}

interface Props {
  data?: PostGetHeroRes['data'];
}

const HeroManagementForm = ({ data }: Props) => {
  const [form] = Form.useForm<FormData>();
  const {token, userid} = useUserStore.getState()
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    const { in_use, order, category, imageDesktop, imageMobile } = e;
    if (imageDesktop === "" && imageMobile === "" && !data) {
      notification.error({
        message: i18next.t("validation.imageRequired"),
      });
      return;
    }

    const formData = new FormData();

    const bodyData = {
      ...e,
    };
    formData.append("data", JSON.stringify(bodyData));

    const reqBody = {
      "userid"        : userid,
      "imageMobile"   : imageMobile ? imageMobile : '-',
      "in_use"        : in_use ? 1 : 0,
      "order"         : Number(order),
      "category"      : category,
      "imageDesktop"  : imageDesktop ? imageDesktop : '-',
    }

    try {
      if (data) {
        const res = await api.updateHero({
          ...reqBody, id: data.id}, token)
        const {data: {code, message}} = res
        console.log(res)
        if (code == 0) {
          notification.success({message: message})
          navigate("/system/hero-management");
        } else {
          notification.error({message: message})
        }
      } else {
        const res = await api.createHero(reqBody, token)
        const {data: {code, message}} = res
        console.log(res)
        if (code == 0) {
          notification.success({message: message})
          navigate("/system/hero-management");
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
    form.setFieldsValue({
      order: data?.order,
      category: data?.category,
      in_use: data?.in_use,
      imageDesktop: data?.imageDesktop,
      imageMobile: data?.imageMobile,
    });
  }, [data]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      {data && (
        <div style={{ display: "flex", gap: "1rem", marginBlock: "1rem" }}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <p>{i18next.t("col.image")}</p>
            <Image
              src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.imageDesktop)}`}
              preview={false}
              wrapperStyle={{ width: "100%" }}
            />
          </div>

          <div style={{ flex: 1, maxWidth: "300px" }}>
            <p>{i18next.t("col.thumbnail")}</p>
            <Image
              src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(data.imageMobile)}`}
              preview={false}
              wrapperStyle={{ width: "100%" }}
            />
          </div>
        </div>
      )}
      <Space>
          <Form.Item
            label={i18next.t("system.desktop")}
            name={"imageDesktop"}
          >
            <CustomUpload type={'imageDesktop'}/>
          </Form.Item>
          <Form.Item
            label={i18next.t("system.mobile")}
            name={"imageMobile"}
          >
            <CustomUpload type={'imageMobile'}/>
          </Form.Item>
        </Space>
      <Form.Item
        label={i18next.t("storeSetting.ss004")}
        name={"category"}
        rules={[{ required: true }]}
      >
        <Select
          options={[
            {
              label: i18next.t("memberDetail.mis131"),
              value: "casino",
            },
            {
              label: i18next.t("col.home"),
              value: "home",
            },
            {
              label: i18next.t("memberDetail.mis132"),
              value: "slot",
            },
            {
              label: i18next.t("system.pxStore"),
              value: "px-store",
            },
            {
              label: i18next.t("memberDetail.mis134"),
              value: "mini-game",
            },
            {
              label: i18next.t("storeSetting.ss013"),
              value: "gold-carrige",
            },
          ]}
        />
      </Form.Item>
      <Form.Item label={i18next.t("banner.bn005")} name={"order"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label={i18next.t("col.inUse")}
        name={"in_use"}
        rules={[{ required: true }]}
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      <Divider />
      <SaveBtn />
    </Form>
  );
};

export default HeroManagementForm;
