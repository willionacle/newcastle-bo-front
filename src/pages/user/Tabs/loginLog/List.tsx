import { api } from "@/api/axios";
import i18next from "@/i18n/i18n";
import { LoginRecords } from "@/api/login-records/get";
import DateText from "@/components/DateText";
import IPLocation from "@/components/IpLocation";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { GF } from "@/utils/GlobalFunctions";
import {
  Button,
  Popconfirm,
  Table,
  TableProps,
  message,
  notification,
} from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: LoginRecords[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  totalItems: number;
}

const List = ({
  data,
  loading,
  onHeaderCell,
  pagination,
  totalItems,
}: Props) => {
  const { userid, token } = useUserStore.getState();
  const { t } = useTranslation();
  const page = pagination.current || 0;
  const limit = pagination.pageSize || 0;

  const cancel = () => {
    message.info(`Block ${t("global.cancel")}`);
  };

  const confirm = async (ip: string) => {
    try {
      const body = {
        userid: userid,
        ip: ip,
        system_note: i18next.t("user.adminBlock"),
      };
      const res = await api.createBlockIP(body, token);
      const {
        data: { code, message },
      } = res;

      if (code == 0) {
        notification.success({
          message: i18next.t("toast.common.blockSuccess"),
        });
      } else {
        notification.success({
          message: message,
        });
      }
    } catch (e: any) {
      notification.error({
        message: i18next.t("toast.common.blockFailed"),
      });
    }
  };

  const columnsArray: TableProps<LoginRecords>["columns"] = [
    // {
    //   title: t("#"),
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   width: 100,
    //   render: (id: number) => id.toLocaleString(),
    // },
    {
      title: "No",
      align: "center",
      width: 100,
      render: (_value, _record, index) =>
        GF.noOrderFormatter({ totalItems, page, limit, index }),
    },
    {
      title: t("memberDetail.mis044"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 200,
      render: (value: LoginRecords["created_at"]) => (
        <DateText date={value} timeStamp />
      ),
    },
    {
      title: t("memberDetail.mis045"),
      dataIndex: "ip",
      key: "ip",
      width: 200,
      align: "center",
    },
    {
      title: t("col.region"),
      dataIndex: "geo_location",
      align: "center",
      render: (value: string) => <IPLocation ip={value} />,
    },
    {
      title: t("memberDetail.mis047"),
      dataIndex: "access_url",
      key: "access_url",
      width: 200,
      align: "center",
    },
    // {
    //   title: t("memberDetail.mis048"),
    //   dataIndex: "user_agent",
    //   key: "user_agent",
    //   width: 400,
    //   align: "center",
    // },
    {
      title: t("memberDetail.mis140"),
      dataIndex: "device",
      key: "device",
      align: "center",
      width: 150,
      render: (value: string, record: LoginRecords) => (
        <span>{value ?? GF.getDeviceInfo(record.user_agent)?.device}</span>
      ),
    },
    {
      title: t("memberDetail.mis141"),
      dataIndex: "system",
      key: "system",
      align: "center",
      width: 150,
      render: (value: string, record: LoginRecords) => (
        <span>{value ?? GF.getDeviceInfo(record.user_agent)?.system}</span>
      ),
    },
    {
      title: t("memberDetail.mis142"),
      dataIndex: "browser",
      key: "browser",
      align: "center",
      width: 150,
      render: (value: string, record: LoginRecords) => (
        <span>{value ?? GF.getDeviceInfo(record.user_agent)?.browser}</span>
      ),
    },
    // {
    //   title: t("memberDetail.mis124"),
    //   dataIndex: "is_admin",
    //   key: "is_admin",
    //   width: 100,
    //   align: "center",
    //   render: (value: LoginRecords["is_admin"]) =>
    //     value ? t("global.true") : t("global.false"),
    // },
    {
      title: t("App"),
      dataIndex: "is_app_login",
      align: "center",
      render: (value: boolean) => (value ? "O" : "X"),
    },
    {
      title: t("global.action"),
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title={i18next.t("title.block")}
          onCancel={cancel}
          onConfirm={() => confirm(record.ip)}
        >
          <Button size="small">{i18next.t("title.block")}</Button>
        </Popconfirm>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key || item.key !== "action" ? { ...item, onHeaderCell } : item,
  );

  return (
    <Table
      sticky
      dataSource={data}
      rowKey={"id"}
      loading={loading}
      columns={columns}
      pagination={pagination}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
