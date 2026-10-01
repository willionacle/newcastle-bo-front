import i18next from "@/i18n/i18n";


import { getUSDTExchangeRate } from '@/api/usdt/get';
import { Form, InputNumber, notification } from 'antd';
import React, { useEffect } from 'react';
import USDTIcon from "@/assets/img/icons/usdt-icon.svg?react"
import { addExchangeRate } from '@/api/usdt/post';
import { useTranslation } from 'react-i18next';
import SaveBtn from '@/components/SaveBtn';

interface FormData {
  rate: number;
}

const USDTExchangeRate: React.FC = () => {
  const {t} = useTranslation()
  const {data, mutate, isLoading} = getUSDTExchangeRate();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = async (e: FormData) => {
    if (e.rate === null || e.rate === undefined || e.rate <= 0) return;

    try {
      const { data } = await addExchangeRate({rate: Number(e.rate)});

      if (data.code == 0) {
        notification.success({
          message: t("global.success"),
          type: "success",
        });
        mutate();
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    if (!isLoading) {
      form.setFieldValue("rate", data?.data?.exchange_rate)
    }
  }, [isLoading])

  return !isLoading && (
      <Form
        className='usdt custom-input-number-wrapper'
        form={form}
        onFinish={handleSubmit}
      >
        <label style={{marginRight: 4, whiteSpace: "nowrap"}}>{i18next.t("header.usdtRate")}</label>
        <Form.Item noStyle name={"rate"} label={i18next.t("header.usdtRate")} required>
          <InputNumber 
            className='custom-input-number'
            size="small" 
            addonBefore={<USDTIcon height={14} />} 
            disabled={isLoading} 
            min={0}
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <SaveBtn 
          size='small' 
          loading={isLoading} 
          customStyle={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }} 
        />
      </Form>
  );
}

export default USDTExchangeRate;