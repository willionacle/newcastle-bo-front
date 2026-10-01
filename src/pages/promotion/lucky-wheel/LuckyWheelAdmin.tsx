import i18next from "@/i18n/i18n";
import React, { useState } from 'react';
import { Card, Tabs, Space, Typography } from 'antd';
import {
  SettingOutlined,
  GiftOutlined
} from '@ant-design/icons';
import Breadcrumb from '@/components/Breadcrumb';
import WeightsTab from './tabs/WeightsTab';
import CouponsTab from './tabs/CouponsTab';
// Legacy import removed - using modern API

const { Title } = Typography;

const LuckyWheelAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('coupons');

  const tabItems = [
    {
      key: 'coupons',
      label: (
        <Space>
          <GiftOutlined />
          <span>{i18next.t("sidemenu.sm017")}</span>
        </Space>
      ),
      children: <CouponsTab />,
    },
    {
      key: 'weights',
      label: (
        <Space>
          <SettingOutlined />
          <span>{i18next.t("promotion.weightManagement")}</span>
        </Space>
      ),
      children: <WeightsTab />,
    },
  ];

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Space direction="vertical" size="small">
            <Breadcrumb replace={i18next.t("sidemenu.luckyWheelSettings")} />
            <Title level={4} style={{ margin: 0 }}>Lucky Wheel Admin</Title>
          </Space>
        </div>

        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabItems}
          size="large"
        />
      </Space>
    </Card>
  );
};

export default LuckyWheelAdmin;