import { useState } from "react";
import { Col, Descriptions, Divider, Empty, List as AntList, Modal, Row, Select, Skeleton, Statistic, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useIpDetailAPI } from "@/api/block-ips/detail";
import { BlockReasonCode, IpAssessment, IpDetailFailureRecord, LoginFailureReason } from "@/api/types";
import DateText from "@/components/DateText";

interface Props {
  ip: string | null;
  onClose: () => void;
}

const ASSESSMENT_META: Record<IpAssessment, { color: string; labelKey: string }> = {
  NO_FAILURES: { color: "default", labelKey: "blockips.assessmentNoFailures" },
  LIKELY_FORGOTTEN_PASSWORD: { color: "blue", labelKey: "blockips.assessmentForgottenPassword" },
  MANY_ACCOUNTS: { color: "red", labelKey: "blockips.assessmentManyAccounts" },
  HIGH_VOLUME: { color: "orange", labelKey: "blockips.assessmentHighVolume" },
};

const REASON_META: Record<BlockReasonCode, { color: string; labelKey: string }> = {
  MANUAL: { color: "default", labelKey: "blockips.reasonManual" },
  AUTO_LOGIN_FAILURES: { color: "volcano", labelKey: "blockips.reasonAutoLoginFailures" },
  ABUSE: { color: "red", labelKey: "blockips.reasonAbuse" },
  HACKING_ATTEMPT: { color: "magenta", labelKey: "blockips.reasonHackingAttempt" },
  OTHER: { color: "default", labelKey: "blockips.reasonOther" },
};

const FAILURE_REASON_LABEL_KEY: Record<LoginFailureReason, string> = {
  BAD_PASSWORD: "blockips.failureReasonBadPassword",
  NO_SUCH_USER: "blockips.failureReasonNoSuchUser",
  ACCOUNT_LOCKED: "blockips.failureReasonAccountLocked",
  IP_BLOCKED: "blockips.failureReasonIpBlocked",
  OTP_FAILED: "blockips.failureReasonOtpFailed",
  PENDING_APPROVAL: "blockips.failureReasonPendingApproval",
  OTHER: "blockips.failureReasonOther",
};

const WINDOW_OPTIONS = [24, 72, 168, 720];

const IpDetailModal = ({ ip, onClose }: Props) => {
  const { t } = useTranslation();
  const [hours, setHours] = useState(24);
  const { data, isLoading } = useIpDetailAPI(ip, hours);
  const detail = data?.data;

  const recentFailuresColumns = [
    {
      title: t("blockips.username"),
      dataIndex: "username",
      key: "username",
      align: "center" as const,
    },
    {
      // Deliberately not "wrong password" — BAD_PASSWORD also covers an
      // unknown username, and the login response can't tell them apart.
      title: t("blockips.failureReasonColumn"),
      dataIndex: "reason",
      key: "reason",
      align: "center" as const,
      render: (value: LoginFailureReason) => t(FAILURE_REASON_LABEL_KEY[value] ?? "blockips.failureReasonOther"),
    },
    {
      title: t("blockips.userAgent"),
      dataIndex: "userAgent",
      key: "userAgent",
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("blockips.bi002"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      render: (value: string) => <DateText date={value} timeStamp />,
    },
  ];

  return (
    <Modal
      open={!!ip}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={800}
      title={
        <span>
          {t("blockips.detailTitle")} — {ip}
        </span>
      }
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
        <Col>
          {detail && (
            <Tag color={detail.blocked ? "red" : "green"}>
              {t(detail.blocked ? "blockips.blockedYes" : "blockips.blockedNo")}
            </Tag>
          )}
          {detail && (
            <Tag color={ASSESSMENT_META[detail.assessment].color}>
              {t(ASSESSMENT_META[detail.assessment].labelKey)}
            </Tag>
          )}
        </Col>
        <Col>
          <Select
            size="small"
            value={hours}
            onChange={setHours}
            style={{ width: 120 }}
            options={WINDOW_OPTIONS.map((h) => ({
              value: h,
              label: h < 24 ? `${h}${t("global.hour")}` : `${h / 24}${t("global.day")}`,
            }))}
          />
        </Col>
      </Row>

      {isLoading && <Skeleton active />}

      {!isLoading && detail && (
        <>
          {detail.block && (
            <>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label={t("blockips.reasonCode")}>
                  <Tag color={REASON_META[detail.block.reasonCode]?.color ?? "default"}>
                    {t(REASON_META[detail.block.reasonCode]?.labelKey ?? "blockips.reasonOther")}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("blockips.blockedBy")}>
                  {detail.block.blockedBy ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("blockips.username")}>
                  {detail.block.username ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("blockips.expiresAt")}>
                  {detail.block.expiresAt ? (
                    <DateText date={detail.block.expiresAt} timeStamp />
                  ) : (
                    t("blockips.permanent")
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t("global.systemNote")} span={2}>
                  {detail.block.systemNote}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
            </>
          )}

          <Row gutter={16}>
            <Col span={8}>
              <Statistic title={t("blockips.failures")} value={detail.failureSummary.failures} />
            </Col>
            <Col span={16}>
              <Statistic
                title={t("blockips.distinctUsernames")}
                value={detail.failureSummary.distinctUsernames}
              />
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <h4>{t("blockips.byReason")}</h4>
              {detail.failureSummary.byReason.length ? (
                <AntList
                  size="small"
                  dataSource={detail.failureSummary.byReason}
                  renderItem={(item) => (
                    <AntList.Item>
                      {t(FAILURE_REASON_LABEL_KEY[item.reason] ?? "blockips.failureReasonOther")}: {item.count}
                    </AntList.Item>
                  )}
                />
              ) : (
                <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Col>
            <Col span={12}>
              <h4>{t("blockips.byUsername")}</h4>
              {detail.failureSummary.byUsername.length ? (
                <AntList
                  size="small"
                  dataSource={detail.failureSummary.byUsername}
                  renderItem={(item) => (
                    <AntList.Item>
                      {item.username}: {item.count}
                    </AntList.Item>
                  )}
                />
              ) : (
                <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Col>
          </Row>

          <Divider />

          <h4>{t("blockips.knownMembers")}</h4>
          {detail.knownMembers.length ? (
            <AntList
              size="small"
              dataSource={detail.knownMembers}
              renderItem={(item) => <AntList.Item>{item.username}</AntList.Item>}
            />
          ) : (
            <Empty description={t("blockips.knownMembersEmpty")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          <Divider />

          <h4>{t("blockips.recentFailures")}</h4>
          <Table<IpDetailFailureRecord>
            size="small"
            rowKey="id"
            dataSource={detail.recentFailures}
            columns={recentFailuresColumns}
            pagination={false}
            scroll={{ y: 240 }}
          />
        </>
      )}
    </Modal>
  );
};

export default IpDetailModal;
