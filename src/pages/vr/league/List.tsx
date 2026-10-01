import { useEffect, useState } from "react";
import i18next from "@/i18n/i18n";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Card,
  Divider,
  Space,
  Table,
  Switch,
  notification,
  Input,
  Button,
} from "antd";
import { getVrLeagueListAPI } from "@/api/vr-game/get";
import { updateVrLeagueAPI } from "@/api/vr-game/patch";
import { ColumnsType } from "antd/es/table";

interface League {
  id: number;
  vr_sports_configs: {
    sports_name_kr: string;
  };
  name: string;
  name_kr: string;
  status: number;
  order: number;
}

const VrLeagueList = () => {
  const [data, setData] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getVrLeagueListAPI();

      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const updateLeagueStatus = async (id: number, val: boolean) => {
    try {
      setLoading(true);

      const status = val ? 1 : 0;

      const res = await updateVrLeagueAPI({
        id,
        status,
      });

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

  const updateLeague = async (item: League) => {
    try {
      setLoading(true);

      const res = await updateVrLeagueAPI({
        id: item.id,
        nameKr: item.name_kr,
        status: item.status,
        order: item.order,
      });

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
      title: i18next.t("col.sport"),
      dataIndex: "sports_name_kr",
      key: "sports_name_kr",
      align: "center",
      render: (_, record) => <>{record.vr_sports_config.sports_name_kr}</>,
    },
    {
      title: i18next.t("title.leagueNameEn"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: i18next.t("title.leagueNameKo"),
      dataIndex: "name_kr",
      key: "name_kr",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={record.name_kr}
          size="small"
          style={{ width: 150 }}
          onChange={(e) => {
            const newName = e.target.value;
            const newList = [...data];
            newList[index] = { ...newList[index], name_kr: newName };
            setData(newList);
          }}
        />
      ),
    },
    {
      title: i18next.t("col.inUse"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked
          checked={record.status ? true : false}
          onChange={(val) => updateLeagueStatus(record.id, val)}
        />
      ),
    },
    {
      title: i18next.t("userGameSettings.orderPlaceholder"),
      dataIndex: "order",
      key: "order",
      align: "center",
      render: (_, record, index) => (
        <Input
          type="number"
          value={record.order}
          size="small"
          style={{ width: 80 }}
          onChange={(e) => {
            const newOrder = Number(e.target.value);
            const newList = [...data];
            newList[index] = { ...newList[index], order: newOrder };
            setData(newList);
          }}
        />
      ),
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => updateLeague(record)}>
            {i18next.t("sportsBet.edit")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card>
      <Space align="center">
        <Breadcrumb replace={i18next.t("vrCfg.leagueSettings")} />
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

export default VrLeagueList;
