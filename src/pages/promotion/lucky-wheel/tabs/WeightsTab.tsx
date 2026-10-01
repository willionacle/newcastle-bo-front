import React, { useState, useEffect } from 'react';
import i18next from "@/i18n/i18n";
import {
  Card,
  Table,
  Button,
  Space,
  InputNumber,
  message,
  notification,
  Typography,
  Tag,
  Tabs,
  Row,
  Col,
  Statistic,
  Tooltip,
  Modal
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useLuckyWheelWeights, saveLuckyWheelWeights } from '@/api/lucky-wheel/weights';
import { Weight } from '@/api/lucky-wheel/types';
import { GF } from '@/utils/GlobalFunctions';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface WeightRowData extends Weight {
  key: string;
  probability?: number;
}

const WeightsTab: React.FC = () => {
  const { t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [editingWeights, setEditingWeights] = useState<WeightRowData[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: weightsData, mutate } = useLuckyWheelWeights(selectedGrade);

  // 가중치 데이터를 테이블용 데이터로 변환
  useEffect(() => {
    if (weightsData?.data?.weights) {
      const weights = weightsData.data.weights;
      const totalWeight = weightsData.data.totalWeight || 1;
      const tableData = weights.map((w, index) => ({
        ...w,
        key: `${w.point_value}-${index}`,
        probability: totalWeight > 0 ? (w.weight / totalWeight) * 100 : 0
      }));
      setEditingWeights(tableData);
    }
  }, [weightsData]);

  // 전체 가중치 계산
  const calculateTotalWeight = () => {
    return editingWeights.reduce((sum, w) => sum + w.weight, 0);
  };

  // 가중치 변경 핸들러
  const handleWeightChange = (key: string, value: number | null) => {
    setEditingWeights(prev => {
      const updated = prev.map(w =>
        w.key === key ? { ...w, weight: value || 0 } : w
      );
      const totalWeight = updated.reduce((sum, w) => sum + w.weight, 0);
      return updated.map(w => ({
        ...w,
        probability: totalWeight > 0 ? (w.weight / totalWeight) * 100 : 0
      }));
    });
  };

  // 포인트 값 변경 핸들러
  const handlePointValueChange = (key: string, value: number | null) => {
    setEditingWeights(prev =>
      prev.map(w =>
        w.key === key ? { ...w, point_value: value || 0 } : w
      )
    );
  };

  // 세그먼트 수 변경 핸들러
  const handleSegmentCountChange = (key: string, value: number | null) => {
    setEditingWeights(prev =>
      prev.map(w =>
        w.key === key ? { ...w, segment_count: value || 1 } : w
      )
    );
  };

  // 표시 순서 변경 핸들러
  const handleDisplayOrderChange = (key: string, value: number | null) => {
    setEditingWeights(prev =>
      prev.map(w =>
        w.key === key ? { ...w, display_order: value || 0 } : w
      )
    );
  };

  // 새 가중치 추가
  const handleAddWeight = () => {
    const newWeight: WeightRowData = {
      key: `new-${Date.now()}`,
      point_value: 0,
      weight: 10,
      segment_count: 1,
      display_order: 0,
      probability: 0
    };
    setEditingWeights([...editingWeights, newWeight]);
  };

  // 가중치 삭제
  const handleDeleteWeight = (key: string) => {
    confirm({
      title: i18next.t("title.deleteWeight"),
      content: i18next.t("title.confirmDeleteWeight"),
      onOk() {
        setEditingWeights(prev => prev.filter(w => w.key !== key));
      }
    });
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (calculateTotalWeight() === 0) {
      message.error(t('toast.promotion.weightZero'));
      return;
    }

    setLoading(true);
    try {
      const weights = editingWeights.map(({ point_value, weight, segment_count, display_order }) => ({
        point_value,
        weight,
        segment_count,
        display_order
      }));

      const response = await saveLuckyWheelWeights(selectedGrade, weights);

      if (response.data.code === 0) {
        notification.success({
          message: t('toast.promotion.saveSuccess'),
          description: t('toast.promotion.saveSuccessDesc', { grade: selectedGrade })
        });
        mutate();
      } else {
        notification.error({
          message: t('toast.promotion.saveFailed'),
          description: response.data.message
        });
      }
    } catch (error) {
      notification.error({
        message: t('toast.promotion.saveFailed'),
        description: t('toast.promotion.saveFailedDesc')
      });
    } finally {
      setLoading(false);
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    if (weightsData?.data?.weights) {
      const weights = weightsData.data.weights;
      const totalWeight = weightsData.data.totalWeight || 1;

      const tableData = weights.map((w: Weight, index: number) => ({
        ...w,
        key: `${w.point_value}-${index}`,
        segment_count: w.segment_count ?? 1,
        display_order: w.display_order ?? index,
        probability: totalWeight > 0 ? (w.weight / totalWeight) * 100 : 0
      }));

      setEditingWeights(tableData);
      message.info(t('toast.promotion.resetDone'));
    }
  };

  const columns = [
    {
      title: i18next.t("title.pointValue"),
      dataIndex: 'point_value',
      key: 'point_value',
      width: 150,
      render: (value: number, record: WeightRowData) => (
        <InputNumber
          value={value}
          min={0}
          max={1000000}
          step={100}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
          onChange={(val) => handlePointValueChange(record.key, val)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: i18next.t("title.weightTitle"),
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (value: number, record: WeightRowData) => (
        <InputNumber
          value={value}
          min={0}
          max={10000}
          onChange={(val) => handleWeightChange(record.key, val)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: i18next.t("title.segmentCount"),
      dataIndex: 'segment_count',
      key: 'segment_count',
      width: 120,
      render: (value: number, record: WeightRowData) => (
        <InputNumber
          value={value}
          min={1}
          max={10}
          onChange={(val) => handleSegmentCountChange(record.key, val)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: i18next.t("userGameSettings.displayOrder"),
      dataIndex: 'display_order',
      key: 'display_order',
      width: 120,
      render: (value: number, record: WeightRowData) => (
        <InputNumber
          value={value}
          min={0}
          max={100}
          onChange={(val) => handleDisplayOrderChange(record.key, val)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: (
        <Space>
          확률
          <Tooltip title={i18next.t("title.weightRatio")}>
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'probability',
      key: 'probability',
      width: 120,
      render: (value: number) => (
        <Tag color={value > 20 ? 'red' : value > 10 ? 'orange' : 'green'}>
          {value.toFixed(2)}%
        </Tag>
      )
    },
    {
      title: i18next.t("title.action"),
      key: 'action',
      width: 80,
      render: (_: any, record: WeightRowData) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteWeight(record.key)}
        />
      )
    }
  ];

  const gradeTabItems = [1, 2, 3, 4, 5, 6, 7].map(grade => ({
    key: String(grade),
    label: GF.handleGradeStrVal(grade),
    children: null
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 등급 선택 탭 */}
      <Card>
        <Tabs
          activeKey={String(selectedGrade)}
          onChange={(key) => setSelectedGrade(Number(key))}
          items={gradeTabItems}
        />
      </Card>

      {/* 통계 정보 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={i18next.t("title.totalWeight")}
              value={calculateTotalWeight()}
              suffix={i18next.t("unit.points")}
              valueStyle={{ color: calculateTotalWeight() > 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={i18next.t("title.pointType")}
              value={editingWeights.length}
              suffix={i18next.t("unit.count")}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={i18next.t("title.avgProbability")}
              value={editingWeights.length > 0 ? (100 / editingWeights.length).toFixed(2) : 0}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 가중치 테이블 */}
      <Card
        title={
          <Space>
            <Title level={5} style={{ margin: 0 }}>
              {GF.handleGradeStrVal(selectedGrade)} 가중치 설정
            </Title>
            <Text type="secondary">
              (총 {editingWeights.length}개 항목)
            </Text>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddWeight}
            >
              항목 추가
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              초기화
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loading}
            >
              저장
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={editingWeights}
          pagination={false}
          size="small"
          scroll={{ y: 400 }}
        />

        {/* 가중치 설명 */}
        <Card style={{ marginTop: 16, backgroundColor: '#f0f2f5' }}>
          <Space direction="vertical">
            <Text>
              <InfoCircleOutlined /> 가중치 설정 안내
            </Text>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>{i18next.t("promotion.weightHelpPoint")}</li>
              <li>{i18next.t("promotion.weightHelpWeight")}</li>
              <li>{i18next.t("promotion.weightHelpProb")}</li>
              <li>{i18next.t("promotion.weightHelpZero")}</li>
            </ul>
          </Space>
        </Card>
      </Card>
    </Space>
  );
};

export default WeightsTab;