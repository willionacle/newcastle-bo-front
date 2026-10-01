import { api } from "@/api/axios";
import { EventItem } from "@/api/stream-community-event/get";
import DateText from "@/components/DateText";
import DeleteBtn from "@/components/DeleteBtn";
import EditBtn from "@/components/EditBtn";
import EditorViewer from "@/components/EditorViewer";
import useDeleteItem from "@/hooks/useDeleteItem";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
// import { GF } from "@/utils/GlobalFunctions";
import { Flex, notification, Space, Switch, Table, TableProps } from "antd";
import { PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";

interface Props {
  data: EventItem[] | undefined;
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any
}

const List = ({ data, loading, pagination, onHeaderCell, mutate }: Props) => {
  const { t } = useTranslation();
  const { deleteItem} = useDeleteItem("deleteScEvent")

  const handleDelete = (id: number) => {
    deleteItem(id,mutate(),{match_id:id});
  };

  const handleChangePopular = async (e: boolean, record: EventItem) => {
    const { token } = useUserStore.getState();
    try {
      const reqBody = {
        match_id: record.MatchID,
        is_visible: e ? 1 : 0,
      };

      const res = await api.toggleScEvent(reqBody, token);

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
    // {
    //   title: t("banner.bn005"),
    //   dataIndex: "order",
    //   key: "order",
    //   render: (value) => value.toLocaleString(),
    //   align: "center",
    // },
    // {
    //   title: t("banner.bn001"),
    //   dataIndex: "image",
    //   align: "center",
    //   render: (value) => (
    //     <Image
    //       height={80}
    //       src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}
    //       preview={{
    //         src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: t("col.thumbnail"),
    //   dataIndex: "thumbnail",
    //   align: "center",
    //   render: (value) =>
    //     value ? (
    //       <Image
    //         height={80}
    //         src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}
    //         preview={{
    //           src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
    //         }}
    //       />
    //     ) : undefined,
    // },
    {
      title: t("bannerDetail.bnr006"),
      dataIndex: "Title",
      render: (value: string) => (value ? value : "-"),
      align: "center",
    },
    {
      title: t("col.content"),
      dataIndex: "Contents",
      render: (value: string) => <Flex justify="center" align="center"><div className="custom-wrap-text">{<EditorViewer data={value} />}</div></Flex>,
      align: "center",
    },
    {
      title: t("col.leagueName"),
      dataIndex: "League",
      key: "League",
      align: "center",
    },
    {
      title: t("col.homeTeam"),
      dataIndex: "HomeTeam",
      key: "HomeTeam",
      align: "center",
    },
    {
      title: t("col.awayTeam"),
      dataIndex: "AwayTeam",
      key: "AwayTeam",
      align: "center",
    },
    {
      title: t("banner.bn002"),
      dataIndex: "StartDate",
      render: (value: string) => <DateText date={value} />,
      align: "center",
    },
    {
      title: t("banner.bn003"),
      dataIndex: "EndDate",
      render: (value: string) => <DateText date={value} />,
      align: "center",
    },
    {
      title: t("col.exposure"),
      dataIndex: "IsVisible",
      align: "center",
      // render: (value: boolean) =>
      //   value ? t("global.true") : t("global.false"),
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangePopular(e, record)}
        />
      ),
    },
    {
      title: t("global.action"),
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditBtn link={`/stream/events/edit/${record.MatchID}`} />
          <DeleteBtn handleDelete={() => handleDelete(Number(record.MatchID))} />
        </Space>
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
        tableLayout="auto"
        pagination={pagination}
      />
    </div>
  );
};

export default List;
