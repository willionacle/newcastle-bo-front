import { api } from "@/api/axios";
import { PostAddBulkCoupon, PostAddCoupon, UserArray } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";
import UserSelect from "@/components/UserSelect";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  RadioChangeEvent,
  Row,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import BulkCouponPayment, { DataType } from "./bulkPayment";
import UploadCSVFile from "@/components/UploadCSVFile";
import CouponNameSelect from "@/components/CouponNameSelect";
import { FlattenOptionData } from "rc-select/lib/interface";
import { BaseOptionType } from "antd/es/select";
import GradeCheckbox from "@/components/GradeCheckbox";
// import LevelSelector from "@/components/LevelSelector";
import UserLevelCheckBox from "@/components/UserLevelCheckBox";

interface FormData {
  userid: number;
  target: "level" | "user" | "status" | "file" | "grade";
  level?: number;
  username: UserArray[];
  coupon_name: FlattenOptionData<BaseOptionType>;
  amount: number;
  expired_date: any;
  system_note: string;
  is_used: number;
  file: string;
  user_grade: string;
  user_level: string;
}

const CouponForm = () => {
  const { token, userid } = useUserStore.getState();
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const [target, setTarget] = useState<FormData["target"]>("user");
  const navigate = useNavigate();
  const [csvData, setCSVData] = useState<any>([]);
  const [searchParam, _] = useSearchParams();
  const level_id = searchParam.get("level_id");
  const username = searchParam.get("username");
  const coupon_name = searchParam.get("coupon_name");
  const system_note = searchParam.get("system_note");
  const coupon_id = searchParam.get("coupon_id");

  const handleSubmit = async (e: FormData) => {
    try {
      let res, reqBody;

      if (target === "file") {
        const validateFileData = csvData.map((item: DataType) => ({
          ...item,
          expired_date: GF.formatDate(
            dayjs(item.expired_date).toISOString(),
            false
          ),
          key: undefined,
        }));
        reqBody = {
          userid: userid,
          arr_data: validateFileData,
        } as PostAddBulkCoupon;
        res = await api.createBulkCoupon(reqBody, token);
      } else {
        reqBody = {
          coupon_id: coupon_id ? parseInt(coupon_id) : null,
          level_id: level_id ? parseInt(level_id) : null,
          userid: userid,
          username: e.username?.map((item) => item.label),
          coupon_name: e.coupon_name?.label,
          system_note: e.system_note,
          amount: e.amount,
          is_used: 0,
          user_grade: e.user_grade ? e.user_grade: null,
          user_level: e.user_level ? e.user_level: null,
          expired_date: GF.formatDate(e.expired_date?.toISOString(), false),
        } as PostAddCoupon;
        res = await api.createCoupon(reqBody, token);
      }

      console.log("Coupon ReqBody", reqBody);

      const {
        data: { code, message },
      } = res;

      if (code === 0) {
        notification.success({
          message: t("global.success"),
          type: "success",
        });
        navigate("/promotion/coupon");
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTargetChange = (e: RadioChangeEvent) => {
    form.setFieldValue("target", e.target.value);
    setTarget(e.target.value);
  };

  useEffect(() => {
    if (level_id && username) {
      form.setFieldsValue({
        username: [{ label: username, value: username }],
      });
    }

    if (coupon_name && username && system_note) {
      form.setFieldsValue({
        username: [{ label: username, value: username }],
        coupon_name: { label: coupon_name, value: coupon_name },
        system_note: system_note,
      });
    }
  }, []);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={"target"} initialValue={target}>
            <Radio.Group onChange={handleTargetChange}>
              <Radio value={"user"}>{t("messageDetail.msgr006")}</Radio>
              <Radio value={"grade"}>{t("col.selectedGrade")}</Radio>
              <Radio value={"level"}>{t("messageDetail.msgr005")}</Radio>
              <Radio value={"file"}>{t("col.excelCouponUpload")}</Radio>
              {/* <Radio value={"status"}>{t("messageDetail.msgr010")}</Radio> */}
            </Radio.Group>
          </Form.Item>
        </Col>

        {target === "user" && (
          <Col span={24}>
            <UserSelect required={true} mode="multiple" />
          </Col>
        )}
        {target === "grade" && (
          <Col span={24}>
            <GradeCheckbox/>
          </Col>
        )}
        {target === "file" && (
          <Col span={24}>
            <UploadCSVFile data={csvData} setData={setCSVData} />
          </Col>
        )}
        {target === "level" && (
          <Col span={10}>
            <UserLevelCheckBox/>
          </Col>
        )}

        {/* {target === "status" && (
          <Col span={8}>
            <Form.Item name={["status"]}>
              <Select mode="multiple" />
            </Form.Item>
          </Col>
        )} */}

        <Divider />
        {(target === "user" || target === "grade" || target === "level") && (
          <>
            <Col span={8}>
              {/* <Form.Item
                label={t("coupon.cp008")}
                name={"coupon_name"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item> */}
              <CouponNameSelect label={t("coupon.cp008")} required={true} />
            </Col>

            <Col span={8}>
              <Form.Item
                label={t("coupon.cp010")}
                name={"amount"}
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={t("couponDetail.cpre001")}
                rules={[{ required: true }]}
                name={"expired_date"}
                initialValue={dayjs().tz().add(7, "day")}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label={t("coupon.cp009")} name={"system_note"}>
                <Input />
              </Form.Item>
            </Col>
          </>
        )}
        {target === "file" && (
          <Col span={24}>
            <BulkCouponPayment data={csvData} setData={setCSVData} />
          </Col>
        )}
      </Row>
      <Divider />

      <SaveBtn />
    </Form>
  );
};

export default CouponForm;
