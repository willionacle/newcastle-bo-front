import { Table } from "antd";
import i18next from "@/i18n/i18n";
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";

const List = () => {
  return (
    <Table
      sticky>
      <Column title={i18next.t("title.upperAgent")} align="center" />
      <Column title={i18next.t("col.id")} align="center" />
      <Column title={i18next.t("col.name")} align="center" />
      <Column title={i18next.t("title.balanceRealtime")} align="center" />

      <ColumnGroup title={i18next.t("col.all")} align="center">
        <Column title={i18next.t("col.bet")} align="center" />
        <Column title={i18next.t("title.betPnl")} align="center" />
      </ColumnGroup>

      <ColumnGroup title="EVO" align="center">
        <Column title={i18next.t("col.bet")} align="center" />
        <Column title={i18next.t("title.betPnl")} align="center" />
      </ColumnGroup>

      <ColumnGroup title="BTI" align="center">
        <Column title={i18next.t("col.bet")} align="center" />
        <Column title={i18next.t("title.betPnl")} align="center" />
      </ColumnGroup>

      <ColumnGroup title={i18next.t("title.pragmaticSlot")} align="center">
        <Column title={i18next.t("col.bet")} align="center" />
        <Column title={i18next.t("title.betPnl")} align="center" />
      </ColumnGroup>

      <ColumnGroup title={i18next.t("title.etc")} align="center">
        <Column title={i18next.t("col.bet")} align="center" />
        <Column title={i18next.t("title.betPnl")} align="center" />
      </ColumnGroup>
    </Table>
  );
};

export default List;
