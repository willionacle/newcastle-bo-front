import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Table } from "antd";
import { getVrSportsConfigListAPI } from "@/api/vr-game/get";
import EditBtn from "@/components/EditBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { ColumnsType } from "antd/es/table";

const VrSportsConfig = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);

      const res = await getVrSportsConfigListAPI();

      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
    },
    {
      title: i18next.t("col.inUse"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => (
        <TrueFalseStatus value={value ? true : false} />
      ),
    },
    {
      title: i18next.t("title.maintenanceMessage"),
      dataIndex: "close_message",
      key: "close_message",
      align: "center",
    },
    {
      title: i18next.t("title.deadline"),
      dataIndex: "close_time",
      key: "close_time",
      align: "center",
      render: (value: number) => <>{value}{i18next.t("unit.sec")}</>,
    },
    {
      title: i18next.t("userGameSettings.orderPlaceholder"),
      dataIndex: "order",
      key: "order",
      align: "center",
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/vr/config/sports/${record.id}`} />
        </>
      ),
    },
  ];

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("vrCfg.sportSettings")} />
      </Space>
      <Divider />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
};

export default VrSportsConfig;
