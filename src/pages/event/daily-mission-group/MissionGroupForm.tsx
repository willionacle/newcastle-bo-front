import DateRange, { DateRangeType } from "@/components/DateRange";
import i18next from "@/i18n/i18n";
import SaveBtn from "@/components/SaveBtn";
import {
  // Button,
  Col,
  Form,
  Input,
  Row,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupItemForm from "./components/GroupItemForm";
import { createMissionGroupAPI, MissionGroupBody } from "@/api/daily-mission/post";
import { MissionGroupData } from "@/api/daily-mission/get";
import Panel from "@/components/Panel";
import { DefaultOptionType } from "antd/es/select";
import { updateMissionGroupAPI } from "@/api/daily-mission/put";
import { Select, SelectProps } from "antd/lib";
// import { PlusCircleOutlined } from "@ant-design/icons";

interface MissionCouponFormList {
  id?: MissionCouponGroupItem['id'];
  item_type?: DefaultOptionType['value'];
  item_name?: DefaultOptionType;
  item_mission_type?: DefaultOptionType;
  item_amount?: MissionCouponGroupItem['item_amount'];
  item_percentage?: MissionCouponGroupItem['item_percentage'];
  item_order?: MissionCouponGroupItem['item_order'];
  display_order?: MissionCouponGroupItem['item_order'];
}

interface FormData extends MissionGroupBody {
  dateRange: DateRangeType;
  mission_count: number;
  items: MissionCouponFormList[];
}

interface Props {
  data?: MissionGroupData;
}

export interface MissionCouponGroupItem {
  id?: number | null;
  item_title?: string;
  item_id?: number,
  item_name?: string;
  item_type?: string;
  item_mission_type?: string | null;
  item_function?: string | null;
  item_amount?: number;
  item_percentage?: number;
  group_id?: number;
  is_new?: number;
  item_order?: number | null
  display_order?: number | null
}

const countOptions: SelectProps['options'] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
]

const MissionGroupForm = ({ data }: Props) => {
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();
  const [mcGroupItem, setMCGroupItem] = useState<MissionCouponGroupItem[]>([ 
    { item_type: 'mission', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'mission', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'mission', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'mission', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null },
    { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null },
  ]);
  const [toDelete, setToDelete] = useState<MissionCouponGroupItem[]>([]);
  const missionCount = Form.useWatch('mission_count', form);

  const handleDelete = (item: MissionCouponGroupItem) => {
    console.log(item)
    const itemName = item.item_name as DefaultOptionType | undefined;
    if (itemName?.value) {
      setToDelete((prev) => ([
        ...prev,
        {
          group_id: data?.id,
          mission_id: itemName?.value as number ?? null,
          mission_type: item.item_type as string,
        }
      ]))
    }
  }

  const handleSubmit = async (e: FormData) => {
    console.log(e);
    const { name, dateRange, items } = e;

    const newItems: MissionCouponGroupItem[] = [];

    items.forEach((item) => {

      const itemName = item.item_name;
      const itemMissionType = item.item_mission_type;

      newItems.push({
        id: data?.id ? (item.id ?? null) : undefined,
        item_id: itemName?.value as number ?? null,
        item_name: itemName?.label as string,
        item_type: item.item_type as string,
        item_mission_type: item.item_type === 'coupon' ? null : itemMissionType?.label as string,
        item_function: item.item_type === 'coupon' ? null : itemMissionType?.value as string,
        item_amount: item.item_amount,
        // item_percentage: item.item_percentage,
        display_order: item.item_order,
        is_new: data?.id ? (item.id && itemName?.value ? 0 : 1) : undefined,
      });

    });

    console.log('NEW ITEMS', newItems);

    const [start, end] = dateRange;
    const reqBody = {
      "group_id"    : data?.id ?? undefined,
      "name"        : name,
      "starthours"  : start?.format('YYYY-MM-DD HH:mm:ss') ?? "",
      "endhours"    : end?.format('YYYY-MM-DD HH:mm:ss') ?? "",
      "is_active"   : 1,
      fields        : JSON.stringify(newItems),
      "deleted_fields": data?.id ? JSON.stringify(toDelete) : undefined
    }

    console.log(toDelete)
    console.log(reqBody)

    try {
      if (data) {
        const res = await updateMissionGroupAPI(reqBody);
        const {data: {code, message}} = res;
        if (code == 0) {
          notification.success({message: message})
          navigate("/event/daily-mission-group-setting");
        } else {
          notification.error({message: message})
        }
      } else {
        const res = await createMissionGroupAPI(reqBody);
        const {data: {code, message}} = res;
        if (code == 0) {
          notification.success({message: message})
          navigate("/event/daily-mission-group-setting");
        } else {
          notification.error({message: message})
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) return;
    const newMission: MissionCouponGroupItem = { item_type: 'mission', item_name: '', item_amount: 0, item_order: null };
    const newCoupon: MissionCouponGroupItem = { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null };
    const newMissionCount = missionCount;
    console.log(newMissionCount)
    const missionArray = Array.from({ length: newMissionCount }, () => ({ ...newMission }));
    const couponArray = Array.from({ length: newMissionCount }, () => ({ ...newCoupon }));

    form.setFieldValue('items', [...missionArray, ...couponArray]);
  }, [missionCount])

  useEffect(() => {
    if (data) {
      const { name, starthours, endhours, missions } = data;
      const missionArray: MissionCouponGroupItem[] = JSON.parse(missions);

      console.log(missionArray)

      const fields: FormData['items']  = [];

      missionArray.forEach(item => {
        const itemMissionType = item.item_mission_type;
        const itemFunction = item.item_function;
        const itemID = item.item_id;
        const itemName = item.item_name;
        const itemType = item?.item_type ?? "";
        fields.push({
          id: item.id,
          item_type: itemType,
          item_name: {value: itemID, label: itemName },
          item_mission_type: {value: itemFunction, label: itemMissionType },
          item_amount: item.item_amount,
          item_order: item.item_order
          // item_percentage: item.item_percentage
        })
      })

      setMCGroupItem(JSON.parse(missions));

      form.setFieldsValue({
        dateRange: [dayjs(starthours).utc(false), dayjs(endhours).utc(false)],
        name: name,
        items: fields
      });
    }
  }, [data])

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col>
            <Form.Item
              label={i18next.t("col.name")}
              name={"name"}
              rules={[{ required: true }]}
            >
              <Input type="text" size="small" />
            </Form.Item>
          </Col>
          <Col>
            <DateRange disablePast showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} required />
          </Col>
          <Col span={2}>
            <Form.Item
              label={i18next.t("mission.missionCount2")}
              name={"mission_count"}
              rules={[{ required: true }]}
              style={{width: '100%'}}
              initialValue={4}
            >
              <Select size="small" options={countOptions} style={{width: '100%'}} disabled={!!data?.id}  />
            </Form.Item>
          </Col>
          {/* <Col span={2} style={{display: 'flex', alignItems: 'center'}}>
            <Button htmlType="button" shape='circle' icon={<PlusCircleOutlined />} onClick={() => {
              const items: MissionCouponGroupItem[] = form.getFieldValue(`items`) || [];
              const indexToInsert = Math.ceil(items.length / 2);
              
              const newMission: MissionCouponGroupItem = { item_type: 'mission', item_name: '', item_amount: 0, item_order: null };
              const newCoupon: MissionCouponGroupItem = { item_type: 'coupon', item_name: '', item_amount: 0, item_order: null };
              
              items.splice(indexToInsert, 0, newMission);
              
              items.push(newCoupon);
              
              form.setFieldValue('items', items);
              
              console.log('Updated items:', items);
            }} /> 
          </Col> */}
        </Row>
        <Panel title={i18next.t("title.missionCouponItem")}>
        <GroupItemForm initialValue={mcGroupItem} handleDelete={handleDelete} />
        </Panel>
        <SaveBtn />
      </Form>
    </>
  );
};

export default MissionGroupForm;
