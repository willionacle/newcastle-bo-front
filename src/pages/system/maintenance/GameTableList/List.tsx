import { BetBlockData } from "@/api/bet-block/types";
import i18next from "@/i18n/i18n";
import { OnHeaderCellType } from "@/hooks/useSort";
import { Modal, Switch, Table, TableProps, notification } from "antd";
import { Image, PaginationProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Row } from "@/components/DraggableTableRow/Row";
import { patchBetBlockAPI } from "@/api/bet-block/patch";
import DeleteBtn from "@/components/DeleteBtn";
import { deleteBetBlockAPI } from "@/api/bet-block/delete";
import { GF } from "@/utils/GlobalFunctions";
import Btn from "@/components/Btn";
import GameTableForm from "./GameTableForm";

interface Props {
  data: BetBlockData[];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
  vendor_id?: string;
}

const List = ({ data, onHeaderCell, loading, mutate, vendor_id }: Props) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<BetBlockData | undefined>();

  const handleChangeBlockGame = async (e: boolean, record: BetBlockData) => {
    if (!vendor_id) {
       notification.error({
        message: "Vendor ID is missing",
      });
      return;
    }
    try {

      const res = await patchBetBlockAPI({
        vender_id: vendor_id,
        table_id: record.table_id
       }, {
        is_blocked: e
      });
      const { data: { code }} = res
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      }
    } catch (error) {
      notification.error({
        message: t("global.fail"),
      });
    }
  };

  const handleDeleteBlockGame = async (record: BetBlockData) => {
    if (!vendor_id) {
       notification.error({
        message: "Vendor ID is missing",
      });
      return;
    }
     try {

      const res = await deleteBetBlockAPI({
        vender_id: vendor_id,
        table_id: record.table_id
       });
      const { data: { code }} = res
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      }
    } catch (error) {
      notification.error({
        message: t("global.fail"),
      });
    }
  };

  const columnsArray: TableProps<BetBlockData>["columns"] = [
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      // render: (_value, _record, index) => ((index ?? 0) + 1),
    },
    {
      title: t("col.tableId"),
      dataIndex: "table_id",
      key: "table_id",
      align: "center",
    },
    {
      title: t("col.virtualTableId"),
      dataIndex: "virtual_table_id",
      key: "virtual_table_id",
      align: "center",
    },
    {
      title: t("col.gameImage"),
      dataIndex: "game_image",
      align: "center",
      render: (value) => value && (
        <Image
          height={80}
          src={`${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`}
          preview={{
            src: `${import.meta.env.VITE_MEDIA_URL}${GF.parseFileName(value)}`,
          }}
        />
      ),
    },
    {
      title: t("col.type"),
      dataIndex: "game_type",
      key: "game_type",
      align: "center",
    },
    {
      title: t("col.gameName"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: i18next.t("col.manage"),
      align: "center",
      render: (_, record) => (
        <>
          <Btn btnType="edit" onClick={() => setTableData(record)} style={{marginRight: 6}} />
          <DeleteBtn handleDelete={() => handleDeleteBlockGame(record)} />
        </>
      ),
    },
    {
      title: t("col.blocked"),
      dataIndex: "isblocked",
      key: "isblocked",
      align: "center",
      render: (value: boolean, record) => {
        return (
          <Switch
            value={value}
            onChange={(e) => handleChangeBlockGame(e, record)}
          />
        )
      },
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );


  return (
    <>
    <Btn
      btnType="create"
      style={{ marginBottom: "1rem" }}
      onClick={() => setTableData({ vendor_id: vendor_id} as BetBlockData)}
    />
    {!loading && (
      <Table
        sticky 
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        components={{ body: { row: Row } }}
        // tableLayout="auto"
        pagination={false}
        loading={loading}
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      />
    )}
      <Modal
        open={tableData !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setTableData(undefined)}
        width={'90%'}
        style={{margin: '1rem auto'}}
      >
        <GameTableForm 
          data={tableData} 
          close={() => {
            mutate();
            setTableData(undefined);
          }} 
        />
      </Modal>
    </>
  );
};

export default List;
