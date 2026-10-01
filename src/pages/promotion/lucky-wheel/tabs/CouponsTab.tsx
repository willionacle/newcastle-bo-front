import React, { useState } from 'react';
import i18next from "@/i18n/i18n";
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  notification,
  message,
  Tag,
  Divider,
  Row,
  Col,
  Popconfirm,
  Tabs,
  Checkbox
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  GiftOutlined
} from '@ant-design/icons';
import {
  useLuckyWheelCoupons,
  issueLuckyWheelCoupon,
  bulkIssueLuckyWheelCoupons,
  bulkIssueLuckyWheelCouponsByFilter,
  deleteLuckyWheelCoupon,
  createDummyCoupon
} from '@/api/lucky-wheel/coupons';
import { useLuckyWheelWeights } from '@/api/lucky-wheel/weights';
import { Coupon, CouponIssueBody, BulkCouponIssueBody, BulkFilterCouponIssueBody, DummyCouponBody } from '@/api/lucky-wheel/types';
import DateText from '@/components/DateText';
import CommaNumber from '@/components/CommaNumber';
import NewColorizeUsername from '@/components/NewColorizeUsername';
import SearchableUserSelect from '@/components/SearchableUserSelect';
import { useLevelGradeConfigs } from '@/api/users/level-grade-configs';
import { GF } from '@/utils/GlobalFunctions';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CouponsTab: React.FC<{username?: string, isUserTab?: boolean}> = ({username, isUserTab}) => {
  const { t } = useTranslation();
  const [individualForm] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [gradeForm] = Form.useForm();
  const [levelForm] = Form.useForm();
  const [dummyForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDummyModalVisible, setIsDummyModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('individual');
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);

  const { swr, paginationProps, setFilters } = useLuckyWheelCoupons(username);
  const { levels, grades } = useLevelGradeConfigs();

  // 현재 활성 탭에 따른 폼 선택
  const getCurrentForm = () => {
    switch (activeTab) {
      case 'individual':
        return individualForm;
      case 'bulk':
        return bulkForm;
      case 'byGrade':
        return gradeForm;
      case 'byLevel':
        return levelForm;
      default:
        return individualForm;
    }
  };

  // 각 탭별 독립적인 쿠폰 타입 감지
  const individualCouponType = Form.useWatch('coupon_type', individualForm);
  const bulkCouponType = Form.useWatch('coupon_type', bulkForm);
  const gradeCouponType = Form.useWatch('coupon_type', gradeForm);
  const levelCouponType = Form.useWatch('coupon_type', levelForm);

  // 각 탭별 독립적인 등급 선택 감지
  const individualSelectedGrade = Form.useWatch('grade', individualForm);
  const bulkSelectedGrade = Form.useWatch('grade', bulkForm);
  const gradeSelectedGrade = Form.useWatch('grade', gradeForm);
  const levelSelectedGrade = Form.useWatch('grade', levelForm);
  const dummySelectedGrade = Form.useWatch('grade', dummyForm);

  // 각 탭별 가중치 데이터 조회
  const { data: individualWeightsData } = useLuckyWheelWeights(individualSelectedGrade);
  const { data: bulkWeightsData } = useLuckyWheelWeights(bulkSelectedGrade);
  const { data: gradeWeightsData } = useLuckyWheelWeights(gradeSelectedGrade);
  const { data: levelWeightsData } = useLuckyWheelWeights(levelSelectedGrade);
  const { data: dummyWeightsData } = useLuckyWheelWeights(dummySelectedGrade);

  // 쿠폰 상태 판별
  const getCouponStatus = (coupon: Coupon) => {
    if (coupon.used_at) return 'used';
    if (coupon.expired_date && dayjs(coupon.expired_date).isBefore(dayjs())) return 'expired';
    return 'available';
  };

  // 상태별 태그 렌더링
  const renderStatusTag = (status: string) => {
    const statusMap = {
      available: { color: 'green', text: i18next.t("promotion.usable") },
      used: { color: 'default', text: i18next.t("itemSend.is009") },
      expired: { color: 'red', text: i18next.t("promotion.expired") }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 날짜를 일수로 변환
  const calculateExpiredDays = (selectedDate: any): number => {
    const days = dayjs(selectedDate).startOf('day').diff(dayjs().startOf('day'), 'days');
    if (days <= 0) {
      message.warning(t('toast.promotion.expiryAfterTomorrow'));
      return 1;
    }
    return days;
  };

  // 쿠폰 발급 처리 (탭에 따라 다르게 처리)
  const handleIssueCoupon = async (values: any) => {
    // 탭별로 다른 처리
    if (activeTab === 'individual') {
      await handleIndividualIssuance(values);
    } else if (activeTab === 'bulk') {
      await handleBulkIssuance(values);
    } else if (activeTab === 'byGrade') {
      await handleGradeIssuance(values);
    } else if (activeTab === 'byLevel') {
      await handleLevelIssuance(values);
    }
  };

  // 개별 쿠폰 발급
  const handleIndividualIssuance = async (values: any) => {
    if (loading) return;
    setLoading(true);
    try {
      const selectedUsers = values.username || [];

      // 선택된 사용자가 없는 경우
      if (selectedUsers.length === 0) {
        notification.warning({
          message: t('toast.coupon.selectUser'),
          description: t('toast.coupon.selectAtLeastOneUser')
        });
        setLoading(false);
        return;
      }

      // 단일 사용자 선택 시
      if (selectedUsers.length === 1) {
        const body: CouponIssueBody = {
          username: selectedUsers[0]?.label || selectedUsers[0],
          grade: values.grade,
          couponType: values.coupon_type,
          amount: values.amount,
          expiredDays: values.expired_date ? calculateExpiredDays(values.expired_date) : 7,
          systemNote: values.system_note
        };

        const response = await issueLuckyWheelCoupon(body);

        if (response.data.code === 0) {
          notification.success({
            message: t('toast.coupon.issueSuccess'),
            description: t('toast.coupon.issueSuccessDesc')
          });
          setIsModalVisible(false);
          individualForm.resetFields();
          swr.mutate();
        } else {
          notification.error({
            message: t('toast.coupon.issueFailed'),
            description: response.data.message
          });
        }
      }
      // 다중 사용자 선택 시 - 일괄 발급 API 사용
      else {
        const usernames = selectedUsers.map((u: any) => u.label || u);

        const body: BulkCouponIssueBody = {
          usernames,
          grade: values.grade,
          couponType: values.coupon_type,
          amount: values.amount,
          expiredDays: values.expired_date ? calculateExpiredDays(values.expired_date) : 7,
          systemNote: values.system_note
        };

        const response = await bulkIssueLuckyWheelCoupons(body);

        if (response.data.code === 0) {
          const { successCount, failedCount = 0, totalCount } = response.data.data;
          notification.success({
            message: t('toast.coupon.issueComplete'),
            description: t('toast.coupon.bulkResult', { total: totalCount, success: successCount }) + (failedCount > 0 ? t('toast.coupon.bulkFailed', { failed: failedCount }) : '')
          });
          setIsModalVisible(false);
          individualForm.resetFields();
          swr.mutate();
        } else {
          notification.error({
            message: t('toast.coupon.issueFailed'),
            description: response.data.message
          });
        }
      }
    } catch (error) {
      notification.error({
        message: t('toast.coupon.issueFailed'),
        description: t('toast.coupon.issueError')
      });
    } finally {
      setLoading(false);
    }
  };

  // 일괄 쿠폰 발급
  const handleBulkIssuance = async (values: any) => {
    if (loading) return;
    setLoading(true);
    try {
      const usernames = values.usernames.split('\n').map((u: string) => u.trim()).filter((u: string) => u);

      const body: BulkFilterCouponIssueBody = {
        filterType: 'username',
        usernames,
        grade: values.grade,
        couponType: values.coupon_type,
        amount: values.amount,
        expiredDays: calculateExpiredDays(values.expired_date),
        systemNote: values.system_note || i18next.t("promotion.bulkIssue")
      };

      const response = await bulkIssueLuckyWheelCouponsByFilter(body);

      if (response.data.code === 0) {
        const result = response.data.data;
        notification.success({
          message: t('toast.coupon.bulkComplete'),
          description: t('toast.coupon.bulkResult', { total: result.totalCount, success: result.successCount }) + (result.failedCount > 0 ? t('toast.coupon.bulkFailed', { failed: result.failedCount }) : '')
        });

        if (response.data.warning) {
          notification.warning({
            message: t('toast.coupon.notice'),
            description: response.data.warning
          });
        }

        setIsModalVisible(false);
        bulkForm.resetFields();
        swr.mutate();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      notification.error({
        message: t('toast.coupon.bulkIssueFailed'),
        description: error.message || t('toast.coupon.issueError')
      });
    } finally {
      setLoading(false);
    }
  };

  // 등급별 쿠폰 발급
  const handleGradeIssuance = async (values: any) => {
    if (loading) return;

    if (selectedGrades.length === 0) {
      message.warning(t('toast.promotion.selectGrade'));
      return;
    }

    setLoading(true);
    try {
      const body: BulkFilterCouponIssueBody = {
        filterType: 'user_grade',
        userGrades: selectedGrades,
        couponType: values.coupon_type,
        grade: values.grade,
        amount: values.amount,
        expiredDays: calculateExpiredDays(values.expired_date),
        systemNote: values.system_note || `등급별 발급 - ${selectedGrades.map(g => grades.find(gr => gr.gradeId === g)?.gradeName || g).join(',')}`
      };

      const response = await bulkIssueLuckyWheelCouponsByFilter(body);

      if (response.data.code === 0) {
        const result = response.data.data;
        notification.success({
          message: t('toast.coupon.gradeComplete'),
          description: t('toast.coupon.bulkResult', { total: result.totalCount, success: result.successCount }) + (result.failedCount > 0 ? t('toast.coupon.bulkFailed', { failed: result.failedCount }) : '')
        });

        if (response.data.warning) {
          notification.warning({
            message: t('toast.coupon.notice'),
            description: response.data.warning
          });
        }

        setIsModalVisible(false);
        gradeForm.resetFields();
        setSelectedGrades([]);
        swr.mutate();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      notification.error({
        message: t('toast.coupon.gradeFailed'),
        description: error.message || t('toast.coupon.issueError')
      });
    } finally {
      setLoading(false);
    }
  };

  // 레벨별 쿠폰 발급
  const handleLevelIssuance = async (values: any) => {
    if (loading) return;

    if (selectedLevels.length === 0) {
      message.warning(t('toast.promotion.selectLevel'));
      return;
    }

    setLoading(true);
    try {
      const body: BulkFilterCouponIssueBody = {
        filterType: 'user_level',
        userLevels: selectedLevels,
        couponType: values.coupon_type,
        grade: values.grade,
        amount: values.amount,
        expiredDays: calculateExpiredDays(values.expired_date),
        systemNote: values.system_note || `레벨별 발급 - Lv.${selectedLevels.join(',')}`
      };

      const response = await bulkIssueLuckyWheelCouponsByFilter(body);

      if (response.data.code === 0) {
        const result = response.data.data;
        notification.success({
          message: t('toast.coupon.levelComplete'),
          description: t('toast.coupon.bulkResult', { total: result.totalCount, success: result.successCount }) + (result.failedCount > 0 ? t('toast.coupon.bulkFailed', { failed: result.failedCount }) : '')
        });

        if (response.data.warning) {
          notification.warning({
            message: t('toast.coupon.notice'),
            description: response.data.warning
          });
        }

        setIsModalVisible(false);
        levelForm.resetFields();
        setSelectedLevels([]);
        swr.mutate();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      notification.error({
        message: t('toast.coupon.levelFailed'),
        description: error.message || t('toast.coupon.issueError')
      });
    } finally {
      setLoading(false);
    }
  };

  // 더미 쿠폰 생성 (결과발급)
  const handleDummyIssuance = async (values: any) => {
    if (loading) return;
    setLoading(true);
    try {
      const body: DummyCouponBody = {
        username: values.username,
        grade: values.grade,
        amount: values.amount,
        datetime: values.datetime ? values.datetime.format('YYYY-MM-DD HH:mm:ss') : undefined
      };

      const response = await createDummyCoupon(body);

      if (response.data.code === 0) {
        notification.success({
          message: t('toast.coupon.dummySuccess'),
          description: t('toast.coupon.dummySuccessDesc')
        });
        setIsDummyModalVisible(false);
        dummyForm.resetFields();
        swr.mutate();
      } else {
        notification.error({
          message: t('toast.coupon.dummyFailed'),
          description: response.data.message
        });
      }
    } catch (error: any) {
      notification.error({
        message: t('toast.coupon.dummyFailed'),
        description: error.message || t('toast.coupon.dummyError')
      });
    } finally {
      setLoading(false);
    }
  };

  // 쿠폰 삭제
  const handleDeleteCoupon = async (id: number) => {
    try {
      const response = await deleteLuckyWheelCoupon(id);

      if (response.data.code === 0) {
        notification.success({
          message: t('toast.coupon.deleteSuccess'),
          description: t('toast.coupon.deleteSuccessDesc')
        });
        swr.mutate();
      } else {
        notification.error({
          message: t('toast.coupon.deleteFailed'),
          description: response.data.message
        });
      }
    } catch (error) {
      notification.error({
        message: t('toast.coupon.deleteFailed'),
        description: t('toast.coupon.deleteError')
      });
    }
  };

  // 검색 처리
  const handleSearch = (values: any) => {
    const filters = {
      username: values.username,
      grade: values.grade,
      status: values.status,
      dateFrom: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      dateTo: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      issuedBy: values.issuedBy
    };
    setFilters({...filters, username: isUserTab ? username : filters.username});
  };

  const columns: TableProps<Coupon>['columns'] = [
    {
      title: 'No',
      align: 'center',
      width: 60,
      render: (_value, _record, index) =>
        (paginationProps(swr.data).total ?? 0) -
        (((paginationProps(swr.data).current ?? 1) - 1) *
          (paginationProps(swr.data).pageSize ?? 100)) -
        index
    },
    {
      title: t("col.userId"),
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      width: 120,
      render: (value: string, record: Coupon) => (
        <NewColorizeUsername
          value={value}
          dateRegistered={record.user_regdate}
          userStatus={record.user_status}
        />
      )
    },
    {
      title: t("col.name"),
      dataIndex: 'user_real_name',
      key: 'user_real_name',
      align: 'center',
    },
    {
      title: t("col.grade"),
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
      width: 80,
      render: (value: number) => <Tag>{GF.handleGradeStrVal(value)}</Tag>
    },
    {
      title: t("col.couponType"),
      dataIndex: 'coupon_type',
      key: 'coupon_type',
      align: 'center',
      width: 100,
      render: (value: number) => (
        <Tag color={value === 1 ? 'blue' : 'green'}>
          {value === 1 ? i18next.t("promotion.fixedAmount") : i18next.t("promotion.randomAmount")}
        </Tag>
      )
    },
    {
      title: t("col.amount"),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 100,
      render: (value: number) => <CommaNumber value={value} />
    },
    {
      title: t("col.status"),
      key: 'status',
      align: 'center',
      width: 100,
      render: (_: any, record: Coupon) => renderStatusTag(getCouponStatus(record))
    },
    {
      title: t("col.usedDateTime"),
      dataIndex: 'used_at',
      key: 'used_at',
      align: 'center',
      width: 150,
      render: (value: string | null) =>
        value ? <DateText date={value} timeStamp /> : '-'
    },
    {
      title: t("col.expiryDate"),
      dataIndex: 'expired_date',
      key: 'expired_date',
      align: 'center',
      width: 120,
      render: (value: string | null) =>
        value ? <DateText date={value} /> : i18next.t("promotion.unlimited")
    },
    {
      title: t("col.issueDate"),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 150,
      render: (value: string) => <DateText date={value} timeStamp />
    },
    {
      title: t("col.issuedBy"),
      dataIndex: 'issuer',
      key: 'issuer',
      align: 'center',
      width: 100
    },
    {
      title: t("col.memo"),
      dataIndex: 'system_note',
      key: 'system_note',
      align: 'center',
      width: 200,
      ellipsis: true
    },
    {
      title: t("col.manage"),
      key: 'action',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_: any, record: Coupon) => (
        <Popconfirm
          title={i18next.t("title.confirmDeleteCoupon")}
          onConfirm={() => handleDeleteCoupon(record.id)}
          okText={i18next.t("global.delete")}
          cancelText={i18next.t("global.cancel")}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 검색 필터 */}
      <Card>
        <Form
          form={filterForm}
          onFinish={handleSearch}
          layout="inline"
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            {!isUserTab && (
              <>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="username" style={{ width: '100%' }}>
                    <Input placeholder={i18next.t("title.userIdTitle")} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="grade" style={{ width: '100%' }}>
                    <Select placeholder={i18next.t("promotion.selectGrade")} allowClear>
                      {[1, 2, 3, 4, 5, 6, 7].map(grade => (
                        <Select.Option key={grade} value={grade}>
                          {GF.handleGradeStrVal(grade)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" style={{ width: '100%' }}>
                <Select placeholder={i18next.t("promotion.selectStatus")} allowClear>
                  <Select.Option value="available">{i18next.t("promotion.usable")}</Select.Option>
                  <Select.Option value="used">{i18next.t("itemSend.is009")}</Select.Option>
                  <Select.Option value="expired">{i18next.t("promotion.expired")}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="issuedBy" style={{ width: '100%' }}>
                <Input placeholder={i18next.t("col.issuedBy")} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="dateRange" style={{ width: '100%' }}>
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  {i18next.t("global.search")}
                </Button>
                <Button
                  onClick={() => {
                    filterForm.resetFields();
                    setFilters(isUserTab ? {username} : {});
                  }}
                  icon={<ReloadOutlined />}
                >
                  초기화
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 쿠폰 목록 */}
      <Card
        title={
          <Space>
            <GiftOutlined />
            <span>{i18next.t("promotion.couponList")}</span>
            {selectedRowKeys.length > 0 && (
              <Tag color="blue">{selectedRowKeys.length}개 선택됨</Tag>
            )}
          </Space>
        }
        extra={!isUserTab && 
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              쿠폰 발급
            </Button>
            <Button
              type="default"
              icon={<GiftOutlined />}
              onClick={() => setIsDummyModalVisible(true)}
            >
              결과발급
            </Button>
          </Space>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={swr.data?.data || []}
          loading={swr.isLoading}
          pagination={paginationProps(swr.data)}
          rowKey="id"
          scroll={{ x: 1500 }}
          size="small"
        />
      </Card>

      {/* 통합 쿠폰 발급 모달 */}
      <Modal
        title={i18next.t("title.issueCoupon")}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          getCurrentForm().resetFields();
          setSelectedLevels([]);
          setSelectedGrades([]);
        }}
        footer={null}
        width={700}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'individual',
              label: i18next.t("promotion.individualIssue"),
              children: (
                <Form
                  form={individualForm}
                  layout="vertical"
                  onFinish={handleIssueCoupon}
                >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <SearchableUserSelect
                required
                mode="multiple"
                label={i18next.t("deposit.de022")}
              />
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label={i18next.t("col.grade")}
                rules={[{ required: true, message: t('toast.promotion.selectGrade') }]}
              >
                <Select>
                  {[1, 2, 3, 4, 5, 6, 7].map(grade => (
                    <Select.Option key={grade} value={grade}>
                      {GF.handleGradeStrVal(grade)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coupon_type"
                label={i18next.t("col.couponType")}
                rules={[{ required: true }]}
                initialValue={1}
              >
                <Select>
                  <Select.Option value={1}>{i18next.t("promotion.fixedAmount")}</Select.Option>
                  <Select.Option value={2}>{i18next.t("promotion.randomAmount")}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label={i18next.t("col.amount")}
                rules={[{
                  required: individualCouponType !== 2,
                  message: t('validation.enterAmount')
                }]}
              >
                {individualCouponType === 1 ? (
                  individualSelectedGrade && individualWeightsData?.data?.weights ? (
                    <Select
                      placeholder={i18next.t("promotion.selectAmount")}
                      showSearch
                      optionFilterProp="children"
                    >
                      {individualWeightsData.data.weights
                        .filter(w => w.point_value > 0)
                        .sort((a, b) => a.point_value - b.point_value)
                        .map(w => (
                          <Select.Option key={w.point_value} value={w.point_value}>
                            {w.point_value.toLocaleString()}원
                          </Select.Option>
                        ))}
                    </Select>
                  ) : (
                    <Select disabled placeholder={i18next.t("promotion.selectGradeFirst")} />
                  )
                ) : (
                  <Input
                    type="number"
                    placeholder={i18next.t("promotion.randomAuto")}
                    disabled={true}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expired_date"
                label={i18next.t("col.expiryDate")}
                rules={[{ required: true }]}
                initialValue={dayjs().add(30, 'day')}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder={i18next.t("promotion.selectExpiry")}
                  showToday={false}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="system_note"
                label={i18next.t("col.systemMemo")}
              >
                <TextArea rows={2} placeholder={i18next.t("promotion.adminMemo")} />
              </Form.Item>
            </Col>
          </Row>
                  <Divider />
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setIsModalVisible(false)}>
                      {i18next.t("global.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      발급
                    </Button>
                  </Space>
                </Form>
              )
            },
            {
              key: 'bulk',
              label: i18next.t("promotion.bulkIssue"),
              children: (
                <Form
                  form={bulkForm}
                  layout="vertical"
                  onFinish={handleIssueCoupon}
                >
                  <Form.Item
                    name="usernames"
                    label={i18next.t("col.userListNewline")}
                    rules={[{ required: true, message: i18next.t("validation.enterUserListField") }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="user1&#10;user2&#10;user3"
                    />
                  </Form.Item>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name="grade"
                        label={i18next.t("col.grade")}
                        rules={[{ required: true, message: t('toast.promotion.selectGrade') }]}
                      >
                        <Select>
                          {grades.map(grade => (
                            <Select.Option key={grade.gradeId} value={grade.gradeId}>
                              {grade.gradeName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="coupon_type"
                        label={i18next.t("col.couponType")}
                        rules={[{ required: true }]}
                        initialValue={1}
                      >
                        <Select>
                          <Select.Option value={1}>{i18next.t("promotion.fixedAmount")}</Select.Option>
                          <Select.Option value={2}>{i18next.t("promotion.randomAmount")}</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="amount"
                        label={i18next.t("col.amount")}
                        rules={[{
                          required: bulkCouponType !== 2,
                          message: t('validation.enterAmount')
                        }]}
                      >
                        {bulkCouponType === 1 ? (
                          bulkSelectedGrade && bulkWeightsData?.data?.weights ? (
                            <Select
                              placeholder={i18next.t("promotion.selectAmount")}
                              showSearch
                              optionFilterProp="children"
                            >
                              {bulkWeightsData.data.weights
                                .filter(w => w.point_value > 0)
                                .sort((a, b) => a.point_value - b.point_value)
                                .map(w => (
                                  <Select.Option key={w.point_value} value={w.point_value}>
                                    {w.point_value.toLocaleString()}원
                                  </Select.Option>
                                ))}
                            </Select>
                          ) : (
                            <Select disabled placeholder={i18next.t("promotion.selectGradeFirst")} />
                          )
                        ) : (
                          <Input
                            type="number"
                            placeholder={i18next.t("promotion.randomAuto")}
                            disabled={true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="expired_date"
                        label={i18next.t("col.expiryDate")}
                        rules={[{ required: true }]}
                        initialValue={dayjs().add(30, 'day')}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                          placeholder={i18next.t("promotion.selectExpiry")}
                          showToday={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="system_note" label={i18next.t("col.memo")}>
                        <Input placeholder={i18next.t("promotion.bulkIssue")} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setIsModalVisible(false)}>
                      {i18next.t("global.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {i18next.t("promotion.bulkIssue")}
                    </Button>
                  </Space>
                </Form>
              )
            },
            {
              key: 'byGrade',
              label: i18next.t("promotion.sendByGrade"),
              children: (
                <Form
                  form={gradeForm}
                  layout="vertical"
                  onFinish={handleIssueCoupon}
                >
                  <Form.Item label={i18next.t("promotion.selectGradeMulti")}>
                    <Checkbox.Group
                      value={selectedGrades}
                      onChange={setSelectedGrades}
                      style={{ width: '100%' }}
                    >
                      <Row gutter={[8, 8]}>
                        {grades.map(grade => (
                          <Col span={8} key={grade.gradeId}>
                            <Checkbox value={grade.gradeId}>
                              {grade.gradeName}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name="grade"
                        label={i18next.t("promotion.commonGradeSetting")}
                        rules={[{ required: true, message: t('toast.promotion.selectGrade') }]}
                      >
                        <Select>
                          {grades.map(grade => (
                            <Select.Option key={grade.gradeId} value={grade.gradeId}>
                              {grade.gradeName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="coupon_type"
                        label={i18next.t("col.couponType")}
                        rules={[{ required: true }]}
                        initialValue={1}
                      >
                        <Select>
                          <Select.Option value={1}>{i18next.t("promotion.fixedAmount")}</Select.Option>
                          <Select.Option value={2}>{i18next.t("promotion.randomAmount")}</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="amount"
                        label={i18next.t("col.amount")}
                        rules={[{
                          required: gradeCouponType !== 2,
                          message: t('validation.enterAmount')
                        }]}
                      >
                        {gradeCouponType === 1 ? (
                          gradeSelectedGrade && gradeWeightsData?.data?.weights ? (
                            <Select
                              placeholder={i18next.t("promotion.selectAmount")}
                              showSearch
                              optionFilterProp="children"
                            >
                              {gradeWeightsData.data.weights
                                .filter(w => w.point_value > 0)
                                .sort((a, b) => a.point_value - b.point_value)
                                .map(w => (
                                  <Select.Option key={w.point_value} value={w.point_value}>
                                    {w.point_value.toLocaleString()}원
                                  </Select.Option>
                                ))}
                            </Select>
                          ) : (
                            <Select disabled placeholder={i18next.t("promotion.selectCommonGradeFirst")} />
                          )
                        ) : (
                          <Input
                            type="number"
                            placeholder={i18next.t("promotion.randomAuto")}
                            disabled={true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="expired_date"
                        label={i18next.t("col.expiryDate")}
                        rules={[{ required: true }]}
                        initialValue={dayjs().add(30, 'day')}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                          placeholder={i18next.t("promotion.selectExpiry")}
                          showToday={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="system_note"
                        label={i18next.t("col.systemMemo")}
                      >
                        <TextArea rows={2} placeholder={i18next.t("promotion.adminMemo")} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setIsModalVisible(false)}>
                      {i18next.t("global.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      등급별 발급
                    </Button>
                  </Space>
                </Form>
              )
            },
            {
              key: 'byLevel',
              label: i18next.t("promotion.sendByLevel"),
              children: (
                <Form
                  form={levelForm}
                  layout="vertical"
                  onFinish={handleIssueCoupon}
                >
                  <Form.Item label={i18next.t("promotion.selectLevelMulti")}>
                    <Checkbox.Group
                      value={selectedLevels}
                      onChange={setSelectedLevels}
                      style={{ width: '100%' }}
                    >
                      <Row gutter={[8, 8]}>
                        {levels.map(level => (
                          <Col span={4} key={level}>
                            <Checkbox value={level}>
                              Lv.{level}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name="grade"
                        label={i18next.t("promotion.gradeForWeight")}
                        rules={[{ required: true, message: t('toast.promotion.selectGrade') }]}
                      >
                        <Select>
                          {grades.map(grade => (
                            <Select.Option key={grade.gradeId} value={grade.gradeId}>
                              {grade.gradeName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="coupon_type"
                        label={i18next.t("col.couponType")}
                        rules={[{ required: true }]}
                        initialValue={1}
                      >
                        <Select>
                          <Select.Option value={1}>{i18next.t("promotion.fixedAmount")}</Select.Option>
                          <Select.Option value={2}>{i18next.t("promotion.randomAmount")}</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="amount"
                        label={i18next.t("col.amount")}
                        rules={[{
                          required: levelCouponType !== 2,
                          message: t('validation.enterAmount')
                        }]}
                      >
                        {levelCouponType === 1 ? (
                          levelSelectedGrade && levelWeightsData?.data?.weights ? (
                            <Select
                              placeholder={i18next.t("promotion.selectAmount")}
                              showSearch
                              optionFilterProp="children"
                            >
                              {levelWeightsData.data.weights
                                .filter(w => w.point_value > 0)
                                .sort((a, b) => a.point_value - b.point_value)
                                .map(w => (
                                  <Select.Option key={w.point_value} value={w.point_value}>
                                    {w.point_value.toLocaleString()}원
                                  </Select.Option>
                                ))}
                            </Select>
                          ) : (
                            <Select disabled placeholder={i18next.t("promotion.selectGradeFirst")} />
                          )
                        ) : (
                          <Input
                            type="number"
                            placeholder={i18next.t("promotion.randomAuto")}
                            disabled={true}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="expired_date"
                        label={i18next.t("col.expiryDate")}
                        rules={[{ required: true }]}
                        initialValue={dayjs().add(30, 'day')}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                          placeholder={i18next.t("promotion.selectExpiry")}
                          showToday={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="system_note"
                        label={i18next.t("col.systemMemo")}
                      >
                        <TextArea rows={2} placeholder={i18next.t("promotion.adminMemo")} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setIsModalVisible(false)}>
                      {i18next.t("global.cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      레벨별 발급
                    </Button>
                  </Space>
                </Form>
              )
            }
          ]}
        />
      </Modal>

      {/* 결과발급 (더미 쿠폰) 모달 */}
      <Modal
        title={i18next.t("title.issueResult")}
        visible={isDummyModalVisible}
        onCancel={() => {
          setIsDummyModalVisible(false);
          dummyForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={dummyForm}
          layout="vertical"
          onFinish={handleDummyIssuance}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                name="username"
                label={i18next.t("promotion.username")}
                rules={[{ required: true, message: i18next.t("validation.enterUsernameRule") }]}
              >
                <Input placeholder="testuser123" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="grade"
                label={i18next.t("col.grade")}
                rules={[{ required: true, message: t('toast.promotion.selectGrade') }]}
              >
                <Select placeholder={i18next.t("promotion.selectGrade")}>
                  {[1, 2, 3, 4, 5, 6, 7].map(grade => (
                    <Select.Option key={grade} value={grade}>
                      {GF.handleGradeStrVal(grade)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="amount"
                label={i18next.t("col.amount")}
                rules={[{ required: true, message: i18next.t("validation.selectAmountField") }]}
              >
                {dummySelectedGrade && dummyWeightsData?.data?.weights ? (
                  <Select placeholder={i18next.t("promotion.selectAmount")} showSearch optionFilterProp="children">
                    {dummyWeightsData.data.weights
                      .filter(w => w.point_value > 0)
                      .sort((a, b) => a.point_value - b.point_value)
                      .map(w => (
                        <Select.Option key={w.point_value} value={w.point_value}>
                          {w.point_value.toLocaleString()}원
                        </Select.Option>
                      ))}
                  </Select>
                ) : (
                  <Select disabled placeholder={i18next.t("promotion.selectGradeFirst")} />
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="datetime"
                label={i18next.t("promotion.creationTime")}
                initialValue={dayjs()}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={i18next.t("promotion.selectCreationTime")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsDummyModalVisible(false)}>
              {i18next.t("global.cancel")}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              생성
            </Button>
          </Space>
        </Form>
      </Modal>

    </Space>
  );
};

export default CouponsTab;