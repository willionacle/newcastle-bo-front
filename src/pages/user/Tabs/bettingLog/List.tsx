import i18next from "@/i18n/i18n";
import { BetLogData } from "@/api/betting-logs/get";
import { ResPostList } from "@/api/types";
import CommaNumber from "@/components/CommaNumber";
import CommaNumber2 from "@/components/CommaNumber2";
import { OnHeaderCellType } from "@/hooks/useSort";
import { GF } from "@/utils/GlobalFunctions";
import { PaginationProps, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  data: ResPostList['data'];
  loading: boolean;
  pagination: PaginationProps;
  onHeaderCell: OnHeaderCellType;
}

const renderStatus = (record: BetLogData) => {
  if (record.bet_amount === record.win_amount) return '';
  else if (record.status === "LOSE") return (<span style={{color: 'var(--ant-color-error-text)'}}>{i18next.t("sportsBet.win")}</span>); // win
  else if (record.status === "WAITING") return i18next.t("status.waiting"); // waiting
  else if (record.status === "WIN") return (<span style={{color: 'var(--ant-color-info-text)'}}>{i18next.t("sportsBet.lose")}</span>); // lose
  else if (record.status === "CANCEL") return i18next.t("global.cancel");
  else if (record.status === "DRAW") return i18next.t("sportsBet.draw");
  else if (record.status === "TIE") return i18next.t("betting.turn_draw"); 
  else if (record.status === "TRANSFER") return i18next.t("betting.transfer"); 
  else return "-";
};

const List = ({ data, loading, pagination, onHeaderCell }: Props) => {
  const { t } = useTranslation();

  const columnsArray: TableProps<BetLogData>["columns"] = [
    {
      title: t("IDX(NO)"),
      dataIndex: "id",
      key: "id",
      width: '6%',
      align: "center",
    },
    {
      title: t("col.provider"),
      dataIndex: "game_history",
      key: "game_history",
      width: '6%',
      align: "center",
      render: (value) => <span style={{textTransform: 'uppercase'}}>{value}</span>
    },
    {
      title: t("col.gameType"),
      dataIndex: "game_type",
      key: "game_type",
      width: '6%',
      align: "center",
      render: (value) => <span style={{textTransform: 'uppercase'}}>{value}</span>
    },
    {
      title: t("col.gameCategory"),
      dataIndex: "game_division",
      key: "game_division",
      width: "20%",
      align: "center",
      render: (value) => {
        if (value.includes('IR_GameType')) {
          return (<div style={{fontSize: 10, whiteSpace: 'normal'}}>{value.match(/IR_GameType:([^:-]+)/)[1] ?? value}</div>)
        } else if (value.includes('GameType') && value.includes('gameData')) {
          try {
            const {gameData:{GameType}} = JSON.parse(value);
            if (GameType.includes('baccarat-')) {
              return GameType.split('-')[0] ?? '-'
            } else {
              return GameType;
            }
          } catch (error) {
            return '-';
          }
        } else {
          return value
        }
      }
    },
    {
      title: t("col.betType"),
      dataIndex: "betting_category",
      key: "betting_category",
      width: '6%',
      align: "center",
      render: (value, record) => { 
        if (value && value !== "-") {
          if (record.game_type === 'sports') {
            return `${value}폴더`;
          } else {
            return value;
          }
        } else {
          try {
            const {gameData:{GameType, GameInfo}} = JSON.parse(record.game_division);
            if (record.game_history === 'pp') {
              return GameInfo === "R" ? i18next.t("payment.normalSpin") : GameInfo;
            } else {
              if (GameType.includes('baccarat-')) {
                return GameType.replace('baccarat-', '')
              } {
                return GameType
              }
            }
          } catch (error) {
            return '-'
          }
        }
      },
    },
    {
      title: t("col.betAmount"),
      dataIndex: "bet_amount",
      key: "bet_amount",
      width: '6%',
      align: "center",
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} onlyNumber /></div>,
    },
    {
      title: t("col.resultAmount"),
      dataIndex: "win_amount",
      key: "win_amount",
      width: '6%',
      align: "center",
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} onlyNumber /></div>,
    },
    {
      title: t("col.profitLoss"),
      dataIndex: "win_loss",
      key: "win_loss",
      width: '6%',
      align: "center",
      render: (value) => <div className="" style={{minWidth: 120}}><CommaNumber value={value} onlyNumber /></div>,
    },
    {
      title: t("col.rolling"),
      dataIndex: "rolling_point",
      key: "rolling_point",
      width: '6%',
      align: "center",
      // render: (value: number, record) => {
      //   const gameDivision = record.game_division;

      //   if (gameDivision.includes('IR_GameType')) {
      //     const gameDivisionExt = gameDivision.match(/IR_GameType:([^:-]+)/);
      //     const category = gameDivisionExt && gameDivisionExt[1];
      //     if (category === 'fish' || category === 'lottery' || category === 'card') {
      //       return '-'
      //     } else {
      //       return <CommaNumber2 value={value} />
      //     }
      //   } else {
      //     return (
      //       <CommaNumber2 value={value} />
      //     )
      //   }
      // },
      render: (value: number) => <CommaNumber2 value={value} />,
    },
    {
      title: t("col.rollingRate"),
      dataIndex: "rolling_rate",
      key: "rolling_rate",
      width: '6%',
      align: "center",
      render: (value: number) => (value ? (value * 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "-"),
    },
    {
      title: t("col.status"),
      dataIndex: "status",
      key: "status",
      width: '6%',
      align: "center",
      render: (_, record) => <div className="" style={{textWrap: 'nowrap'}}>{renderStatus(record)}</div>
    },
    {
      title: t("col.betDateTime"),
      dataIndex: "bet_date",
      key: "bet_date",
      width: '10%',
      align: "center",
      render: (_, record) => GF.cleanDateString(record.bet_date, true)
      ,
    },
    {
      title: t("col.transactionId"),
      dataIndex: "transaction_id",
      key: "transaction_id",
      align: "center",
      width: "20%",
      render: (value) => <div style={{fontSize: 10, whiteSpace: 'normal'}}>{value}</div>
    },
  ];

  const columns = columnsArray.map((item) =>
    item.key !== "action" && item.key ? { ...item, onHeaderCell } : item
  );

  return (
    <Table
      sticky 
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={"id"}
      tableLayout="auto"
      scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
      pagination={pagination}
    />
  );
};

export default List;
