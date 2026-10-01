import i18next from "@/i18n/i18n";
import {
  DepositMethodUser,
  depositMethodUserListStateQuery,
  useDepositMethodList,
} from "@/api/deposit-method/get";
import UserStatus from "@/components/UserStatus";
import { Button, Flex, notification, Popconfirm, Select, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMemo, useState } from "react";
import Filter from "./Filter";
import { GF } from "@/utils/GlobalFunctions";
import "./DepositMethodStyle.css";
import { updateBatchTypeDepositMethod } from "@/api/deposit-method/post";
import { Link } from "react-router-dom";
import ColorizeUsername from "@/components/ColorizeUsername";
import DownloadExcelBtn from "./DownloadExcelBtn";

export default function List({ depositMethod }: { depositMethod: string }) {
  const { data: methodList } = useDepositMethodList();
  const { swr, onHeaderCell, paginationProps, setFilters } =
    depositMethodUserListStateQuery(depositMethod);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [localChanges, setLocalChanges] = useState<Record<string, string>>({});
  const [globalSelectedMethod, setGlobalSelectedMethod] = useState<
    string | undefined
  >(undefined);
  const pagination = useMemo(() => {
    return paginationProps(swr.data?.count);
  }, [swr]);

  const handleBatchUpdate = async () => {
    if (selectedRowKeys.length === 0) return;

    const batch_updates = selectedRowKeys
      .map((key) => {
        const username = key.toString();
        const methodToApply = localChanges[username] || globalSelectedMethod;

        return {
          username,
          deposit_method: methodToApply,
        };
      })
      .filter((item) => item.deposit_method);

    if (batch_updates.length === 0) {
      return;
    }

    const payload = {
      current_type: depositMethod,
      batch_updates,
    };

    try {
      const response = await updateBatchTypeDepositMethod(payload);
      if (response.code === 0) {
        notification.success({
          message: response.message,
          type: "success",
        });
        swr.mutate()
        setSelectedRowKeys([]);
        setLocalChanges({});
        setGlobalSelectedMethod(undefined);
      } else {
        notification.error({
          message: response.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnsType<DepositMethodUser> = [
    {
      title: i18next.t("title.number"),
      // key: "no",
      align: "center",
      width: 80,
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: i18next.t("col.id"),
      dataIndex: "username",
      // key: "username",
      align: "center",
      render: (value, record) => (
        <Link to={`/user/${record.user_id}`}>
          <ColorizeUsername username={value} />
        </Link>
      ),
    },
    {
      title: i18next.t("col.name"),
      dataIndex: "user_real_name",
      // key: "user_real_name",
      align: "center",
      render: (value: string) => value || "-",
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "user_status",
      // key: "user_status",
      align: "center",
      render: (value) => <UserStatus status={value} />,
    },
    {
      title: i18next.t("col.grade"),
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (value: number) => GF.handleGradeStrVal(value),
    },
    {
      title: i18next.t("col.level"),
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (value: number) => value ?? "-",
    },
    {
      title: i18next.t("col.depositType"),
      dataIndex: "deposit_method",
      align: "center",
      width: 200,
      render: (value, record) => {
        const username = `${record.username}`;
        const isSelected = selectedRowKeys.includes(username);

        if (!isSelected) {
          const currentMethod = methodList?.find(
            (m) => m.type === depositMethod,
          );
          return currentMethod ? currentMethod.title : depositMethod || "-";
        }

        const currentDisplayedValue =
          localChanges[username] || globalSelectedMethod || value;

        return (
          <Select
            value={currentDisplayedValue}
            style={{ width: "100%" }}
            size="small"
            placeholder={i18next.t("title.select")}
            options={methodList?.map((item) => ({
              label: item.title,
              value: item.type,
            }))}
            onChange={(newValue) => {
              setLocalChanges((prev) => ({
                ...prev,
                [username]: newValue,
              }));
            }}
          />
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columnsArray = columns.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item,
  );

  return (
    <>
      <Flex justify="end">
        <DownloadExcelBtn method={depositMethod} fileNameProp={methodList?.find(
            (m) => m.type === depositMethod,
          )?.displayName}/>
      </Flex>
      <Filter setFilters={setFilters} />
      <Flex justify="end" gap={10} style={{ marginBottom: "12px" }}>
        <Select
          placeholder={i18next.t("depoMethod.selectMethodToChange")}
          style={{ width: 180 }}
          value={globalSelectedMethod}
          options={methodList?.map((item) => ({
            label: item.title,
            value: item.type,
          }))}
          onChange={(val) => {
            setGlobalSelectedMethod(val);
            setLocalChanges({});
          }}
          allowClear
        />
        <Popconfirm
          title={i18next.t("title.saveChanges")}
          description={i18next.t("depoMethod.confirmChangeUsers", { count: selectedRowKeys.length })}
          onConfirm={handleBatchUpdate}
          okText={i18next.t("global.true")}
          cancelText={i18next.t("title.no")}
          disabled={selectedRowKeys.length === 0}
        >
          <Button disabled={selectedRowKeys.length === 0}>
            변경 사항 저장
          </Button>
        </Popconfirm>
      </Flex>
      <Table
        rowKey="username"
        columns={columnsArray}
        rowSelection={rowSelection}
        dataSource={swr.data?.data ?? []}
        loading={swr.isLoading}
        pagination={pagination}
        rowClassName={(record) =>
          selectedRowKeys.includes(String(record.username))
            ? "selected-row-purple"
            : ""
        }
      />
    </>
  );
}
