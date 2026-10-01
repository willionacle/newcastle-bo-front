import { useState, useEffect, useMemo } from "react";
import i18next from "@/i18n/i18n";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Space,
  Modal,
  Divider,
  Popconfirm,
  notification,
  Switch,
  Typography,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  useDepositMethodList,
  DepositMethodItem,
} from "@/api/deposit-method/get";
import {
  updateDepositMethod,
  UpdateDepositMethodParams,
  deleteDepositMethod,
} from "@/api/deposit-method/post";
import { disableDepositAccountsByTypeAPI } from "@/api/deposit-account/put";
import commaNumber from "comma-number";
import useEditor from "@/hooks/editor/Editor";
import { toEditorContent, toMemoPreview, toMemoString } from "./memoContent";
import { notifyBulkError, notifyBulkResult } from "./bulkResult";
import DepositMethodUserListModal from "./components/deposit-method-users/DepositMethodUserListModal";

const { Option } = Select;
const { Paragraph } = Typography;

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: UpdateDepositMethodParams) => void;
  item?: DepositMethodItem;
}

const EditModal = ({ visible, onCancel, onConfirm, item }: EditModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // 에디터 초기값은 마운트 시점에만 반영된다. 부모가 행마다 key 로 remount 한다.
  // 기존 평문 memo 는 줄 단위 문단으로 변환해서 띄운다.
  const memoContent = useMemo(() => toEditorContent(item?.memo), [item]);
  const { el: memoEditor, value: memoValue } = useEditor(memoContent);

  useEffect(() => {
    if (visible && item) {
      form.setFieldsValue({
        type: item.type,
        title: item.title,
        status: item.status,
        displayName: item.displayName,
        isInput: item.isInput || 0,
        bankName: item.bankName || "",
        accountNumber: item.accountNumber || "",
        accountName: item.accountName || "",
        showMemo: item.showMemo || 0,
        syncToAccountsBankInfo: false,
        syncToAccountsStatus: false,
      });
    }
  }, [visible, item, form]);

  const handleSubmit = async (values: any) => {
    if (!item) return;

    const params: UpdateDepositMethodParams = {
      id: item.id,
      ...values,
      memo: toMemoString(memoValue),
    };

    onConfirm(params);
  };

  return (
    <Modal
      title={i18next.t("title.editDepositMethod")}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={i18next.t("title.type")}
          name="type"
          rules={[
            { required: true, message: t("validation.enterType") },
            {
              pattern: /^\S*$/,
              message: t("validation.noWhitespace"),
            },
          ]}
        >
          <Input placeholder={i18next.t("depoMethod.enterType")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("col.title")}
          name="title"
          rules={[{ required: true, message: t("validation.enterTitle") }]}
        >
          <Input placeholder={i18next.t("depoMethod.enterTitle")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.displayName")}
          name="displayName"
          rules={[{ required: true, message: t("validation.enterDisplayName") }]}
        >
          <Input placeholder={i18next.t("depoMethod.enterDisplayName")} />
        </Form.Item>

        <Form.Item
          label={i18next.t("col.status")}
          name="status"
          rules={[{ required: true, message: t("validation.selectStatus") }]}
        >
          <Select placeholder={i18next.t("depoMethod.selectStatus")}>
            <Option value={1}>{i18next.t("status.active")}</Option>
            <Option value={0}>{i18next.t("status.inactive")}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.inputAvailability")}
          name="isInput"
          extra={i18next.t("depoMethod.inputAvailabilityDesc")}
        >
          <Select placeholder={i18next.t("depoMethod.selectInputAvailability")}>
            <Option value={1}>{i18next.t("status.inputAllowed")}</Option>
            <Option value={0}>{i18next.t("status.inputNotAllowed")}</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">{i18next.t("depoMethod.accountInfoOptional")}</Divider>

        <Form.Item label={i18next.t("col.bankName")} name="bankName">
          <Input placeholder={i18next.t("depoMethod.enterBankName")} />
        </Form.Item>

        <Form.Item label={i18next.t("col.accountNumber")} name="accountNumber">
          <Input placeholder={i18next.t("depoMethod.enterAccountNumber")} />
        </Form.Item>

        <Form.Item label={i18next.t("col.accountHolder")} name="accountName">
          <Input placeholder={i18next.t("depoMethod.enterAccountHolder")} />
        </Form.Item>

        <Divider orientation="left">{i18next.t("depoMethod.memoSettingOptional")}</Divider>

        <Form.Item
          label={i18next.t("col.memo")}
          extra={i18next.t("depoMethod.memoEditorHelp")}
        >
          {memoEditor}
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.memoDisplay")}
          name="showMemo"
          extra={i18next.t("depoMethod.memoDisplayDesc")}
        >
          <Select placeholder={i18next.t("depoMethod.selectMemoDisplay")}>
            <Option value={1}>{i18next.t("userGameSettings.shown")}</Option>
            <Option value={0}>{i18next.t("userGameSettings.hidden")}</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">{i18next.t("depoMethod.fullSyncOptions")}</Divider>

        <Form.Item
          label={i18next.t("depoMethod.syncAllAccountInfo")}
          name="syncToAccountsBankInfo"
          valuePropName="checked"
          extra={i18next.t("depoMethod.syncAllAccountInfoDesc")}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={i18next.t("depoMethod.syncAllStatus")}
          name="syncToAccountsStatus"
          valuePropName="checked"
          extra={i18next.t("depoMethod.syncAllStatusDesc")}
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {i18next.t("sportsBet.edit")}
            </Button>
            <Button onClick={onCancel}>{i18next.t("global.cancel")}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DepositMethodManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    status: undefined as number | undefined,
    type: undefined as string | undefined,
    q: undefined as string | undefined,
    is_detailed: "true",
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<
    DepositMethodItem | undefined
  >();
  const [depositMethod, setDepositMethod] = useState<string | undefined>();
  const { data, mutate, isLoading } = useDepositMethodList(searchParams);

  const handleEdit = (item: DepositMethodItem) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };
  const handleShowUserList = (type: string) => {
    setDepositMethod(type);
  };

  const handleEditConfirm = async (params: UpdateDepositMethodParams) => {
    try {
      const response = await updateDepositMethod(params);
      if (response.code === 0) {
        notification.success({
          message: t("toast.depositMethod.updateSuccess"),
        });
        setEditModalVisible(false);
        setEditingItem(undefined);
        mutate();
      } else {
        notification.error({
          message: response.message || t("toast.depositMethod.updateFailed"),
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      notification.error({ message: t("toast.depositMethod.updateError") });
    }
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      const response = await deleteDepositMethod(id);
      if (response.code === 0) {
        notification.success({
          message: t("toast.depositMethod.deleteSuccess"),
          description: t("toast.depositMethod.deleteSuccessDesc", { type }),
        });
        mutate(); // Refresh the list
      } else {
        notification.error({
          message: t("toast.depositMethod.deleteFailed"),
          description: response.message || t("toast.depositMethod.deleteFailedDesc"),
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMsg = error.response.data.message;
        notification.error({
          message: t("toast.depositMethod.deleteFailed"),
          description: errorMsg || t("toast.depositMethod.deleteError"),
        });
      } else {
        notification.error({
          message: t("toast.depositMethod.deleteFailed"),
          description: t("toast.common.networkError"),
        });
      }
    }
  };

  const handleDisableAll = async (type: string) => {
    try {
      const res = await disableDepositAccountsByTypeAPI(type);
      notifyBulkResult(res.data);
      mutate();
    } catch (error) {
      notifyBulkError(error);
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams((prev) => ({
      ...prev,
      status: values.status,
      type: values.type,
      q: values.q,
    }));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center" as const,
    },
    {
      title: i18next.t("title.type"),
      dataIndex: "type",
      key: "type",
      width: 100,
      align: "center" as const,
    },
    {
      title: i18next.t("title.backofficeDisplayName"),
      dataIndex: "title",
      key: "title",
      width: 150,
      align: "center" as const,
    },
    {
      title: i18next.t("title.userpageDisplayName"),
      dataIndex: "displayName",
      key: "displayName",
      width: 150,
      align: "center" as const,
    },
    {
      title: i18next.t("col.bankName"),
      dataIndex: "bankName",
      key: "bankName",
      width: 100,
      align: "center" as const,
      render: (text: string) => text || "-",
    },
    {
      title: i18next.t("col.accountNumber"),
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      align: "center" as const,
      render: (text: string) => text || "-",
    },
    {
      title: i18next.t("col.accountHolder"),
      dataIndex: "accountName",
      key: "accountName",
      width: 100,
      align: "center" as const,
      render: (text: string) => text || "-",
    },
    {
      title: i18next.t("col.status"),
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center" as const,
      render: (status: number) => (
        <span style={{ color: status === 1 ? "#52c41a" : "#ff4d4f" }}>
          {status === 1 ? i18next.t("status.active") : i18next.t("status.inactive")}
        </span>
      ),
    },
    {
      title: i18next.t("title.input"),
      dataIndex: "isInput",
      key: "isInput",
      width: 80,
      align: "center" as const,
      render: (isInput: number) => (
        <span style={{ color: isInput === 1 ? "#1890ff" : "#8c8c8c" }}>
          {isInput === 1 ? i18next.t("status.possible") : i18next.t("status.notPossible")}
        </span>
      ),
    },
    {
      title: i18next.t("col.memo"),
      dataIndex: "memo",
      key: "memo",
      width: 220,
      align: "left" as const,
      render: (text: string) => {
        // memo 는 Slate JSON(신규) 또는 평문(기존)이라 목록에서는 평문만 뽑아 보여준다
        const preview = toMemoPreview(text);

        return preview ? (
          <Paragraph
            ellipsis={{
              rows: 2,
              tooltip: {
                title: <span style={{ whiteSpace: "pre-wrap" }}>{preview}</span>,
                overlayStyle: { maxWidth: 400 },
              },
            }}
            style={{ marginBottom: 0 }}
          >
            {preview}
          </Paragraph>
        ) : (
          "-"
        );
      },
    },
    {
      title: i18next.t("title.memoDisplay"),
      dataIndex: "showMemo",
      key: "showMemo",
      width: 80,
      align: "center" as const,
      render: (showMemo: number) => (
        <span style={{ color: showMemo === 1 ? "#52c41a" : "#8c8c8c" }}>
          {showMemo === 1 ? i18next.t("userGameSettings.shown") : i18next.t("userGameSettings.hidden")}
        </span>
      ),
    },
    {
      title: i18next.t("title.userCountTitle"),
      dataIndex: "totalUsers",
      key: "totalUsers",
      align: "center" as const,
      width: 80,
      render: (value: number) => commaNumber(value),
    },
    {
      title: i18next.t("userGameSettings.action"),
      key: "action",
      width: 380,
      align: "center" as const,
      render: (_: any, record: DepositMethodItem) => (
        <Space size="small">
          <Popconfirm
            title={i18next.t("depoMethodBulk.disableAll.confirmTitle")}
            description={i18next.t("depoMethodBulk.disableAll.confirmDesc", { type: record.type })}
            onConfirm={() => handleDisableAll(record.type)}
            okText={i18next.t("depoMethodBulk.disableAll.button")}
            cancelText={i18next.t("global.cancel")}
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<PoweroffOutlined />}>
              {i18next.t("depoMethodBulk.disableAll.button")}
            </Button>
          </Popconfirm>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleShowUserList(record.type)}
          >
            상세보기
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {i18next.t("sportsBet.edit")}
          </Button>
          <Popconfirm
            title={i18next.t("title.deleteDepositMethod")}
            description={i18next.t("depoMethod.confirmDeleteType", { type: record.type })}
            onConfirm={() => handleDelete(record.id, record.type)}
            okText={i18next.t("global.delete")}
            cancelText={i18next.t("global.cancel")}
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {i18next.t("global.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Form layout="inline" onFinish={handleSearch} style={{ flex: 1 }}>
          <Form.Item name="status" label={i18next.t("col.status")}>
            <Select style={{ width: 120 }} placeholder={i18next.t("col.all")} allowClear>
              <Option value={1}>{i18next.t("status.active")}</Option>
              <Option value={0}>{i18next.t("status.inactive")}</Option>
            </Select>
          </Form.Item>

          <Form.Item name="q" label={i18next.t("global.search")}>
            <Input style={{ width: 200 }} placeholder={i18next.t("depoMethod.searchTitleDisplay")} />
          </Form.Item>

          <Form.Item name="type" label={i18next.t("title.type")}>
            <Input style={{ width: 200 }} placeholder={i18next.t("depoMethod.searchType")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {i18next.t("global.search")}
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/payment/deposit-method/create")}
        >
          입금방법 추가
        </Button>
      </div>

      <Divider />

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: `${import.meta.env.VITE_DEFALUT_TABLE_SCROLL}` }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => i18next.t("depoMethod.totalCount", { total }),
        }}
      />

      <EditModal
        key={editingItem?.id}
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingItem(undefined);
        }}
        onConfirm={handleEditConfirm}
        item={editingItem}
      />

      <DepositMethodUserListModal
        depositMethod={depositMethod}
        onCancel={() => setDepositMethod(undefined)}
      />
    </div>
  );
};

export default DepositMethodManagement;
