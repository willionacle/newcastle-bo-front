import SaveBtn from "@/components/SaveBtn";
import {
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CouponNameData } from "@/api/coupon-name/get";
import { CouponNameBody, createCouponName, updateCouponName } from "@/api/coupon-name/post";
import { useEffect } from "react";

type FormData = CouponNameBody 

interface Props {
  data: CouponNameData | undefined
}

const CouponNameForm = ({data}: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormData) => {
    console.log(e)
    try {

      let res;

      if (data) {
        res = await updateCouponName({...e, id: data.id, is_active: 1})
      } else {
        res = await createCouponName(e)
      }

      const {data: {code, message}} = res

      if (code === 0) {
        notification.success({
          message: t("global.success"),
          type: "success",
        });
        navigate("/promotion/coupon-name");
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if(data) {
      form.setFieldsValue({
        name: data.name,
        coupon_content: data.coupon_content
      })
    }
  }, [data])

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
          <>
            <Col span={8}>
              <Form.Item
                label={t("coupon.cp008")}
                name={"name"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

           
            <Col span={8}>
              <Form.Item label={t("coupon.cp012")} name={"coupon_content"}>
                <Input />
              </Form.Item>
            </Col>
          </>
      </Row>
        <Divider />
  
        <SaveBtn />
    </Form>
  );
};

export default CouponNameForm;
