import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { LeagueData } from "@/api/stream-community/get";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { notification, Switch, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { GF } from "@/utils/GlobalFunctions";
import { useEffect, useState } from "react";

interface Props {
  data: LeagueData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, onHeaderCell,pagination, mutate }: Props) => {
  const { t } = useTranslation();
  const [koreanMap, setKoreanMap] = useState<Record<string, string>>({});

  useEffect(() => {
  const loadTranslations = async () => {
    if (!data) return;
    const newMap: Record<string, string> = {};

    for (const item of data) {
      const title = item.title;
      if (!title) continue;

      if (koreanMap[title]) {
        newMap[title] = koreanMap[title];
        continue;
      }

      const kr = await GF.translateToKorean(title);
      newMap[title] = kr;
    }

    setKoreanMap(prev => ({ ...prev, ...newMap }));
  };

  loadTranslations();
}, [data]);

  const handleChangeVisible = async (e: boolean, record: LeagueData) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        id: record.id,
        is_visible: e ? 1 : 0,
      };

      const res = await api.toggleScLeague(reqBody, token);

      const {
        data: { code },
      } = res;
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.error({
          message: t("global.error"),
          duration: 1,
          type: "success",
        });
      }
    } catch (error) {
      notification.error({
        message: t("global.fail"),
      });
    }
  };

  const columnsArray: TableProps["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      width:"100px",
    },
    {
      title: t("col.sport"),
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: t("col.countryName"),
      dataIndex: "country",
      key: "country",
      align: "center",
    },
    {
      title: t("col.title"),
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: t("col.koreanTitle"),
      key: "korean_title",
      align: "center",
      render: (_, record: LeagueData) => koreanMap[record.title] ?? i18next.t("system.translating"),
      hidden: true,
    },
    {
      title: t("col.showHide"),
      dataIndex: "is_visible",
      align: "center",
      width:"200px",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeVisible(e, record)}
        />
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <div>
      <Table
        sticky
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={"id"}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={pagination}
      />
    </div>
  );
};

export default List;
