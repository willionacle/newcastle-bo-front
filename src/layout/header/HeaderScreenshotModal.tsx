import i18next from "@/i18n/i18n";
import { Col, Modal, Row } from "antd";
import styled from "styled-components";
import { RecentTrans, StatsDataType } from "@/api/cs-statics/totalStatics";
import HeaderItem3 from "./HeaderItem3";
import HeaderItem3a from "./HeaderItem3a";
import HeaderItem3b from "./HeaderItem3b";
import HeaderItem3c from "./HeaderItem3c";
import HeaderItem4 from "./HeaderItem4";
import HeaderItem5 from "./HeaderItem5";
import HeaderItemDepositRank from "./HeaderItemDepositRank";
import GradeUserMonthlyTable from "@/components/GradeUserMonthlyTable";

interface Props {
  open: boolean;
  onClose: () => void;
  data: StatsDataType | null;
  recentTrans?: RecentTrans;
  stopSound: () => void;
}

// The header blocks use inline-styled ul/li sized for the header dropdown.
// Shrink them only inside this modal so everything fits on one screen.
const CompactSection = styled.div`
  ul,
  li {
    font-size: 11px !important;
    padding: 2px 6px !important;
    line-height: 14px !important;
  }
  .ant-typography {
    font-size: 11px !important;
    line-height: 14px !important;
  }
`;

// GradeUserMonthlyTable sets its own inline cell styles; shrink further only here.
const CompactGradeTable = styled.div`
  .ant-table-cell {
    font-size: 10px !important;
    padding: 1px 6px !important;
    line-height: 12px !important;
  }
`;

/**
 * "스크린샷보기": every header dashboard block at a compact size on one screen, for screenshots.
 * Reuses the Header's socket-fed data; only GradeUserMonthlyTable makes its own request.
 */
const HeaderScreenshotModal = ({ open, onClose, data, recentTrans, stopSound }: Props) => {
  const statsLoading = !data;
  const transLoading = !recentTrans;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="80vw"
      title={i18next.t("screenshot.view", "스크린샷보기")}
      style={{ top: 20 }}
      styles={{ body: { overflowX: "auto" } }}
      destroyOnClose
    >
      <CompactSection>
        {/* 상단: 랭킹 / 보유금 / 오늘 / 당월 / 입금랭킹 / 통계 */}
        <Row gutter={4} style={{ marginBottom: 4 }} wrap={false}>
          <Col flex={"0.7"}>
            <HeaderItem3 data={data} loading={statsLoading} stopSound={stopSound} />
          </Col>
          <Col flex={"auto"}>
            <HeaderItem3c data={recentTrans} total={data?.total_holding} loading={transLoading} />
          </Col>
          <Col flex={"auto"}>
            <HeaderItem3a data={recentTrans} loading={transLoading} />
          </Col>
          <Col flex={"auto"}>
            <HeaderItem3b data={recentTrans} loading={transLoading} />
          </Col>
          <Col flex={"auto"}>
            <HeaderItemDepositRank data={recentTrans} loading={transLoading} />
          </Col>
          <Col flex={"auto"}>
            <HeaderItem5 loading={statsLoading} data={data} />
          </Col>
        </Row>

        {/* 하단: 등급별 베팅유저수(좌) + 합계 테이블(우) */}
        <Row gutter={6} align="top" wrap={false}>
          <Col flex="0 0 210px">
            <CompactGradeTable>
              <GradeUserMonthlyTable />
            </CompactGradeTable>
          </Col>
          <Col flex="auto">
            <HeaderItem4 loading={statsLoading} data={data} />
          </Col>
        </Row>
      </CompactSection>
    </Modal>
  );
};

export default HeaderScreenshotModal;
