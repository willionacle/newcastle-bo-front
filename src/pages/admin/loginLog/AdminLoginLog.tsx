import Breadcrumb from "@/components/Breadcrumb";
import { Alert, Button, Card, Divider, Flex } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import List from "./List";
import RegisteredIpModal from "./RegisteredIpModal";
import { adminLoginRecords } from "@/api/login-records/get";
import adminIpAlertStore from "@/store/adminIpAlert.store";

const AdminLoginLog = () => {
  const { t } = useTranslation();
  const { swr, onHeaderCell, paginationProps } = adminLoginRecords();
  const [ipModalOpen, setIpModalOpen] = useState(false);
  // Filled by the poll in Layout (useSuspiciousAdminLoginAPI)
  const { hasAlert, count, distinctIps, windowHours, latest } =
    adminIpAlertStore();

  return (
    <Card>
      <Breadcrumb />
      <Divider />

      <Flex vertical gap={12} style={{ marginBottom: 16 }}>
        {hasAlert && (
          <Alert
            type="error"
            showIcon
            icon={<WarningOutlined />}
            message={t("adminLog.adl015", {
              hours: windowHours,
              count,
              ips: distinctIps,
            })}
            description={
              latest
                ? `${latest.user} · ${latest.ip} · ${latest.ip_location ?? "-"}`
                : undefined
            }
          />
        )}

        <Flex justify="flex-end">
          <Button onClick={() => setIpModalOpen(true)}>
            {t("adminLog.adl016")}
          </Button>
        </Flex>
      </Flex>

      <List
        data={swr.data?.data}
        loading={swr?.isLoading}
        pagination={paginationProps(swr.data?.totalitems)}
        onHeaderCell={onHeaderCell}
      />

      <RegisteredIpModal
        open={ipModalOpen}
        onClose={() => setIpModalOpen(false)}
      />
    </Card>
  );
};

export default AdminLoginLog;
