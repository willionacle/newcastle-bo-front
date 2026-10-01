import i18next from "@/i18n/i18n";
import { ResPostList, SWRType } from "@/api/types";
import { deleteUVAccount } from "@/api/uv-account/delete";
import { UVAccountData } from "@/api/uv-account/get";
import { fullUpdateUVAccount } from "@/api/uv-account/put";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, notification, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<ResPostList[]>>;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUVAccount(id);

      const {data: {code, message}} = res

      if (code === 0) {
        mutate();
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }

    } catch (error) {
      console.error(error)
    }
  };

  const handleFullUpdate = async (record: UVAccountData) => {
    try {
      const { type, title, bank_name, account_name, account_number } = record;
      const res = await fullUpdateUVAccount({type, title, bank_name, account_name, account_number});

      const {data: {code, message}} = res

      if (code === 0) {
        mutate();
        notification.success({
          message: message,
          type: "error",
        });
      } else {
        notification.error({
          message: message,
          type: "error",
        });
      }

    } catch (error) {
      console.error(error)
    }
  };

  const columnsArray: TableProps<UVAccountData>["columns"] = [
    {
      title: t("col.accountName"),
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: t("col.bank"),
      dataIndex: "bank_name",
      key: "bank_name",
      align: "center",
      render: (value: number) => value,
    },
    {
      title: t("col.accountNumber"),
      dataIndex: "account_number",
      key: "account_number",
      align: "center",
      render: (value: number) => value,
    },
    {
      title: t("col.accountHolder"),
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      render: (value: number) => value,
    },
    {
      title: t("col.usableLevel"),
      dataIndex: "reg_level",
      key: "reg_level",
      align: "center",
      render: (value: string) => {
        const levels = value && value.includes('[') ? JSON.parse(value) : [];
        return (
          <div className="">{
            levels.map((item: number, index: number) => (
              <span key={index}>Lv{item}{index < levels.length - 1 && ', '}</span>
            ))
          }</div>
        )
      },
    },
    {
      title: t("col.usableGrade"),
      dataIndex: "reg_grade",
      key: "reg_grade",
      align: "center",
      render: (value: string) => {
        try {   
          if (!value) return;
          let grades = value.includes('[') ? JSON.parse(value) : [];
  
          if (typeof grades === 'string' && grades.includes('[')) grades = JSON.parse(grades);
  
          return (
            <div className="">{
              grades.map((item: number, index: number) => (
                <span key={index}>{GF.handleGradeStrVal(item)}{index < grades.length - 1 && ', '}</span>
              ))
            }</div>
          )
        } catch (error) {
          return '-'
        }
      },
    },
    {
      title: t("col.activeUser"),
      dataIndex: "reg_excel",
      key: "reg_excel",
      align: "center",
      render: (value: string) => {
        const file = value && value.includes('[') ? JSON.parse(value) : [];
        const url = file.length > 0 ? `${import.meta.env.VITE_MEDIA_URL}${file[0]}` : undefined;
        return value && file.length > 0 && (
          <Button 
            size="small" 
            icon={<DownloadOutlined />} 
            onClick={() => window.open(url, "_blank")} 
            style={{
              backgroundColor: 'unset', color: 'var(--ant-color-primary)'
            }}
          >
            {GF.shortenFilename(file[0])}
          </Button>
        );
      },
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditBtn link={"/system/usdt-account/" + record.idx} />
          <DeleteBtn handleDelete={() => handleDelete(record.idx)} />
          <Button onClick={() => handleFullUpdate(record)} style={{backgroundColor: 'var(--ant-color-success)'}}>{i18next.t("system.updateAll")}</Button>
        </Space>
      ),
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky 
      dataSource={data}
      loading={loading}
      pagination={pagination}
      columns={columns}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
    />
  );
};

export default List;
