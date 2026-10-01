import { api } from "@/api/axios";
import { GameMaintenanceData } from "@/api/game-maintenances/get";
import DetailBtn from "@/components/DetailBtn";
import { OnHeaderCellType } from "@/hooks/useSort";
import useUserStore from "@/store/user.store";
import { Modal, Switch, Table, TableProps, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GameList from "./GameList/GameList";
import { useSearchParams } from "react-router-dom";
import GameImageUploadPreview from "./components/GameImageUploadPreview";
import { Active, DndContext, DragEndEvent, Over } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Row } from "@/components/DraggableTableRow/Row";
import { DragHandle } from "@/components/DraggableTableRow/DragHandle";
import { updateGameOrder, UpdateGameOrderBody } from "@/api/game-maintenances/put";
import GameTableList from "./GameTableList/GameTableList";

interface Props {
  data: GameMaintenanceData[];
  loading: boolean;
  onHeaderCell: OnHeaderCellType;
  mutate: any;
}

const GameCategories = ['slot-lobby', 'minigame-lobby', 'fish-lobby', 'card-lobby', 'live-lobby', 'dsports-lobby']

const List = ({ data, onHeaderCell, loading, mutate }: Props) => {
  const [dataSource, setDataSource] = useState<GameMaintenanceData[]>(data);
  const { t } = useTranslation();
  const [vendorIDModalOpen, setVendorIDModalOpen] = useState<string | undefined>();
  const { token, userid } = useUserStore.getState();
  const [search]= useSearchParams()

  const updateList = async (sortedList: GameMaintenanceData[], active: Active, over: Over | null) => {
    const newDisplayOrder = sortedList.findIndex(record => record.id === active.id);
    // const oldDisplayOrder = sortedList.find(record => record.id === active.id)?.display_order;

    const activeID = active.id as number;
    const overID = over?.id as number;

    try {
      const reqBody: UpdateGameOrderBody = {
        id: activeID as number,
        id2: overID as number,
        // display_order_old: oldDisplayOrder ?? 0,
        display_order: newDisplayOrder + 1,
      }
      const res = await updateGameOrder(reqBody);
      console.log(res)
      const { data: { code }} = res
      if (code === 0) {
        notification.success({
          message: t("global.success"),
          duration: 1,
          type: "success",
        });
        mutate();
      } else {
        notification.error({
          message: t("global.fail"),
          duration: 1,
          type: "success",
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    let arrMove: GameMaintenanceData[] = [];
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.id === active?.id);
        const overIndex = prevState.findIndex((record) => record.id === over?.id);
        arrMove = arrayMove(prevState, activeIndex, overIndex);
        
        return arrMove;
      });
      updateList(arrMove, active, over);
    }
  };

  const handleChangeMaintenance = async (e: boolean, record: GameMaintenanceData) => {
    try {
      const reqBody = {
        userid: userid,
        vendor_id: record.vendor_id,
        game_category: record.game_category,
        is_maintenance: e ? 1 : 0
      }

      const res = await api.toggleVendor(reqBody, token);
      const { data: { code }} = res
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

  const handleGameListShow = (record: GameMaintenanceData) => {
    setVendorIDModalOpen(record.vendor_id)
  }

  const handleChangePopular = async (e: boolean, record: GameMaintenanceData) => {
    try {
      const reqBody = {
        userid: userid,
        id: record.id,
        is_popular: e ? 1 : 0
      }

      const res = await api.togglePopular(reqBody, token);
      const { data: { code }} = res
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

  const columnsArray: TableProps<GameMaintenanceData>["columns"] = [
    { 
      key: 'sort', 
      align: 'center', 
      width: 80, 
      render: () => <DragHandle /> 
    },
    {
      title: t("#"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_value, _record, index) => ((index ?? 0) + 1),
    },
    {
      title: t("col.image"),
      dataIndex: "game_image",
      key: "game_image",
      align: "center",
      width: 500,
      render: (value: string, record, index) => <GameImageUploadPreview value={value} record={record} index={index} mutate={mutate} />
    },
    {
      title: t("maintenance.mt001"),
      dataIndex: "vendor_name",
      key: "vendor_name",
      align: "center",
      render: (value) => <span style={{textTransform: 'capitalize'}}>{value}</span>
    },
    // {
    //   title: t("maintenance.mt002"),
    //   dataIndex: "gameName",
    //   key: "gameName",
    //   align: "center",
    // },
    {
      title: t("maintenance.mt007"),
      dataIndex: "game_name",
      key: "game_name",
      align: "center",
    },
    {
      title: t("col.popularGame"),
      dataIndex: "is_popular",
      key: "is_popular",
      align: "center",
      fixed: "right",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangePopular(e, record)}
        />
      ),
    },
    {
      title: t("maintenance.mt008"),
      dataIndex: "game_name_en",
      key: "game_name_en",
      align: "center",
      render: (value, record) => value ?? record.vendor_name,
    },
    {
      title: t("col.exposureRank"),
      dataIndex: "display_order",
      key: "display_order",
      align: "center",
      width: 80
    },
    {
      title: t("maintenance.mt005"),
      dataIndex: "is_maintenance",
      key: "is_maintenance",
      align: "center",
      fixed: "right",
      render: (value: boolean, record) => (
        <Switch
          value={value}
          onChange={(e) => handleChangeMaintenance(e, record)}
        />
      ),
    },
    {
      title: t("maintenance.mt006"),
      // dataIndex: "is_maintenance",
      key: "gameList",
      align: "center",
      fixed: "right",
      render: (_, record) => (
          GameCategories.includes(record.game_category.toLocaleLowerCase()) && 
            <DetailBtn onClick={() => handleGameListShow(record)} />
      )
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  const finalColumn = !GameCategories.includes(search.get('game_category') ?? '') ? columns.filter(item => item.key !== 'gameList') : columns

  useEffect(() => {
    if (data && data.length > 0) {
      setDataSource(data);
    } else {
      setDataSource([])
    }
  }, [data]);
  
  return (
    <>
    {!loading && (
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={dataSource.map((i) => i.id)} strategy={verticalListSortingStrategy}>    
          <Table
            sticky 
            columns={finalColumn}
            dataSource={dataSource}
            rowKey={"id"}
            components={{ body: { row: Row } }}
            tableLayout="auto"
            pagination={false}
            loading={loading}
            scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
          />
        </SortableContext>
      </DndContext>
    )}
    <Modal
        open={vendorIDModalOpen !== undefined}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setVendorIDModalOpen(undefined)}
        width={'90%'}
        style={{margin: '1rem auto'}}
      >
        {search.get('game_category') === "live" ? (
          <GameTableList vendor_id={vendorIDModalOpen?.split("_")?.[0]} />
        ) : (
          <GameList vendor_id={vendorIDModalOpen} game_category={search.get('game_category') ?? undefined} />
        )}
      </Modal>
    </>
  );
};

export default List;
