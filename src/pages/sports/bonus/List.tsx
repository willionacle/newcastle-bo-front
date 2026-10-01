import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, Divider, Space, Table, notification } from "antd";
import { getSportsBonusListAPI } from "@/api/sports-list/get";
import { deleteBonusAPI } from "@/api/sports-list/delete";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import CreateBtn from "@/components/CreateBtn";
import TrueFalseStatus from "@/components/TrueFalseStatus";
import { ColumnsType } from "antd/es/table";

const SportsBonusList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getSportsBonusListAPI();
      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const deleteBonus = async (id: number) => {
    try {
      setLoading(true);
      const res = await deleteBonusAPI(id);

      if (res.status === 200) {
        notification.success({ message: res.data.message });
        fetchList();
      } else {
        notification.error({ message: res.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: i18next.t("sportsBet.folderCount"),
      dataIndex: "folder_count",
      key: "folder_count",
      align: "center",
    },
    {
      title: i18next.t("col.odds"),
      dataIndex: "odds",
      key: "odds",
      align: "center",
    },
    {
      title: i18next.t("col.home"),
      dataIndex: "home_name",
      key: "home_name",
      align: "center",
    },
    {
      title: i18next.t("col.away"),
      dataIndex: "away_name",
      key: "away_name",
      align: "center",
    },
    {
      title: i18next.t("title.minOdds"),
      dataIndex: "min_odds",
      key: "min_odds",
      align: "center",
    },
    {
      title: i18next.t("title.errorMessage"),
      dataIndex: "error_message",
      key: "error_message",
      align: "center",
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: number) => (
        <TrueFalseStatus value={value ? true : false} />
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <EditBtn link={`/sports/bonus/${record.id}`} />
          <DeleteBtn handleDelete={() => deleteBonus(record.id)} />
        </>
      ),
    },
  ];

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("sports.bonusSettings")} />
        <CreateBtn />
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

export default SportsBonusList;
