import { MissionGroupData } from "@/api/daily-mission/get";
import i18next from "@/i18n/i18n";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
// import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
// import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Button, Space, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { deleteMission } from "@/api/daily-mission/delete";
import { SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import SaveAsTemplateModal from "./components/SaveAsTemplateModal";
interface Props {
  data: MissionGroupData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const [templateSource, setTemplateSource] = useState<MissionGroupData | null>(null);
  // const { deleteItem} = useDeleteItem('deleteEvent')

  // const handleDelete = (id: number) => {
  //   deleteItem(id, mutate());
  // };

  const columnsArray: TableProps<MissionGroupData>["columns"] = [
    {
      title: "No",
      align: "center",
      render: (_value, _record, index) =>
        (pagination.total ?? 0) -
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100) -
        index,
    },
    {
      title: t("event.missionGroupName"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("event.period"),
      dataIndex: "starthours",
      key: "starthours",
      align: "center",
      width: 300,
      render: (value, record) => (
        <div>
          <DateText date={value} timeStamp /> -{" "}
          <DateText date={record.endhours} timeStamp />
        </div>
      ),
    },
    {
      title: t("event.registeredDate"),
      dataIndex: "created_at",
      render: (value: string) => <DateText date={value} />,
      align: "center",
    },
    {
      title: i18next.t("title.missionCount"),
      dataIndex: "count",
      key: "count",
      align: "center",
      width: 100,
    },
    {
      title: t("event.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (value) => {
        let status = "";

        if (value == 0) status = i18next.t("status.scheduled"); // scheduled
        if (value == 1) status = i18next.t("status.ended"); // finished
        if (value == 2) status = i18next.t("status.ongoing"); // in progress

        return status;
      },
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      width:300,
      render: (_, record) => {
        // const endDate = new Date(record.endhours).toISOString().split("T")[0];
        // const dateNow = new Date().toLocaleDateString('en-CA');

        // const showDelete = dateNow > endDate;

        return (
          <Space>
            {record.status == 0 && (
              <EditBtn
              link={`/event/daily-mission-group-setting/edit/${record.id}`}
            />
            )}
            <Button
              size="small"
              icon={<SaveOutlined />}
              onClick={() => setTemplateSource(record)}
            >
              {t("missionTemplate.saveAsTemplate")}
            </Button>
            {/* <ResetBtn handleReset={() => handleDelete(Number(record.id))} label="관리자클리어" /> */}
            {(record.status == 0 || record.status == 1) && (
              <DeleteBtn
                handleDelete={async () => {
                  if (await deleteMission(record.id)) {
                    mutate();
                  }
                }}
              />
            )} 
          </Space>
        )
      },
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
        tableLayout="auto"
        pagination={pagination}
      />
      <SaveAsTemplateModal
        open={!!templateSource}
        groupId={templateSource?.id}
        defaultName={templateSource?.name}
        onClose={() => setTemplateSource(null)}
      />
    </div>
  );
};

export default List;
