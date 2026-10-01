import { updateUserBirthday } from "@/api/user-birthday/post";
import SaveBtn from "@/components/SaveBtn";
import { GF } from "@/utils/GlobalFunctions";
import { DatePicker, Form, notification } from "antd"
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface FormData {
  birthday: Dayjs
}

const UserBirthdayForm = ({
  username,
  birthday,
  mutate,
}: {
  username: string;
  birthday: string;
  mutate: any;
}) => {
  const { t } = useTranslation();
  const [form3] = Form.useForm<FormData>();

  const onFinish = async (values: FormData) => {
    const reqBody = {
      username,
      birthday: GF.formatDate(values.birthday.format(), false) || "",
    }

    console.log(reqBody, values.birthday.format());
    try {
      const res = await updateUserBirthday(reqBody)

      const {code, message} = res.data
  
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          type: "success",
        });
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      mutate();
    }
  }

  useEffect(() => {
    if (birthday) {
      form3.setFieldValue("birthday", dayjs(birthday));
    }
  }, [birthday])

  return (
    <Form
      form={form3}
      onFinish={onFinish}
      layout="inline"
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.25rem",
      }}
    >
      <Form.Item
        name="birthday"
      >
        <DatePicker size="small" style={{ width: "100%" }} />
      </Form.Item>

      <SaveBtn className="user-button alt" size="small" />
    </Form>
  )
}

export default UserBirthdayForm;