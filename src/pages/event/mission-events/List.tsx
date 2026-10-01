import { MissionEventsData } from "@/api/daily-mission/mission-events/get";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Flex, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import MissionStatusTag from "./components/MissionStatusTag";
import { KeyedMutator } from "swr";
import { SWRType } from "@/api/types";
import ColorizeUsername from "@/components/ColorizeUsername";

interface Props {
  data: MissionEventsData[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: KeyedMutator<SWRType<MissionEventsData[]>>;
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<MissionEventsData>["columns"] = [
    {
      title: 'No',
      align: "center",
      render: (_value, _record, index) => (pagination.total ?? 0) - (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 100)) - index
    },
    {
      title: t("ID"),
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (value) => <ColorizeUsername username={value} />
    },
    {
      title: t("event.name"),
      dataIndex: "user_real_name",
      key: "user_real_name",
      align: "center",
      render: (_, record) => <ColorizeUsername username={record.username} returnRealName />
    },
    {
      title: t("event.missionGroup"),
      dataIndex: "mission_group",
      key: "mission_group",
      align: "center",
    },
    {
      title: t("event.period"),
      dataIndex: "mission_perion",
      key: "mission_perion",
      align: "center",
      width: 300,
    },
    {
      title: t("event.progress"),
      dataIndex: "mission_percentage",
      key: "mission_percentage",
      align: "center",
      width: 100,
      render: (_value: number, record) => {
        const missionLength = record.mission_items.length;
        const finishedItems = missionLength > 0 ? record.mission_items.filter(item => item.status === 1).length : 0;
        // const decimal = value / 100;
        // const fraction = decimal * missionLength;
        return `${finishedItems}/${missionLength}`
      },
    },
    {
      title: t("event.progressStatus"),
      dataIndex: "mission_items",
      key: "mission_items",
      align: "center",
      width: 100,
      render: (value: MissionEventsData['mission_items'], record) => 
        <Flex gap={4}>{
          value.map((item, index) => (
            <MissionStatusTag key={index} rowData={record} record={item} index={index} mutate={mutate} />
          ))
        }</Flex>
      ,
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
    </div>
  );
};

export default List;
