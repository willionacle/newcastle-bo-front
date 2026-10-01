import { LoginRecords } from "@/api/login-records/get";
import DateText from "@/components/DateText";
import IPLocation from "@/components/IpLocation";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { parse } from "qs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface Props {
  data: LoginRecords[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

interface QueryData {
  ip: string;
  username: string;
}

interface LoginData {
  ip: string;
}

const List = ({ data, loading, onHeaderCell, pagination }: Props) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [query, setQuery] = useState<QueryData>();

  const filteredData = useMemo(() => {
    const newData = data?.filter((item) => !item.is_admin);
    const searchParams = parse(search.replace("?", "")) as unknown as QueryData;
    const ip = searchParams?.ip;
    if (!ip) {
      return newData;
    }

    const uniqueUsers = new Map<string, LoginRecords>();

    if (ip) {
      newData?.forEach((record) => {
        if (record.ip === ip) {
          const existingRecord = uniqueUsers.get(record.user);
          if (
            !existingRecord ||
            new Date(record.login_date_time) >
              new Date(existingRecord.login_date_time)
          ) {
            uniqueUsers.set(record.user, record);
          }
        }
      });

      const result = [...uniqueUsers.values()];

      return result;
    }
  }, [query, data]);

  const handleColor = ({ user, ip }: LoginRecords) => {
    if (query && query.username && query.ip) {
      const bool = query.username !== user || query.ip !== ip;
      return bool ? "var(--ant-color-error-text)" : "";
    } else {
      return "";
    }
  };

  const countOccurrences = (columnKey: keyof LoginData) => {
    const counts: Record<string, number> = {};
    if (data) {
      data.forEach((item) => {
        const value = item[columnKey];
        counts[value] = (counts[value] || 0) + 1;
      });
      return counts;
    }
  };

  const nameCounts = countOccurrences("ip");

  const columnsArray: TableProps<LoginRecords>["columns"] = [
    // {
    //   title: "#",
    //   dataIndex: "id",
    //   align: "center",
    // },
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("ID"),
      dataIndex: "user",
      align: "center",
      render: (value, record) => (
        <Link
          to={`/user/${record.user_id}`}
          style={{ color: handleColor(record) }}
        >
          {value}
        </Link>
      ),
    },
    {
      title: t("memberInfo.mi006"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      // render: (_, record) => <ColorizeUsername username={record.user} returnRealName />
    },
    {
      title: t("adminLog.adl007"),
      dataIndex: "ip",
      align: "center",
      render: (value, _record) => ({
        props: {
          style: {
            color: nameCounts && (nameCounts[value] > 1 ? "red" : "inherit"),
          },
        },
        children: (
          <span
          // style={{color: handleColor(record)}}
          >
            {value}
          </span>
        ),
      }),
    },
    {
      title: t("adminLog.adl008"),
      dataIndex: "login_date_time",
      align: "center",
      render: (value: string) => <DateText date={value} timeStamp />,
    },
    {
      title: t("col.region"),
      dataIndex: "geo_location",
      align: "center",
      render: (value: string) => <IPLocation ip={value} />,
    },
    {
      title: t("adminLog.adl010"),
      dataIndex: "status",
      align: "center",
      render: (value: boolean) =>
        value ? t("global.true") : t("global.false"),
    },
    {
      title: t("App"),
      dataIndex: "is_app_login",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item,
  );

  useEffect(() => {
    const searchParams = parse(search.replace("?", "")) as unknown as QueryData;

    if (searchParams && searchParams.ip && searchParams.username) {
      setQuery(searchParams);
    } else {
      setQuery(undefined);
    }
  }, [search]);

  return (
    <Table
      sticky
      dataSource={filteredData}
      rowKey={"id"}
      loading={loading}
      columns={columns}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
