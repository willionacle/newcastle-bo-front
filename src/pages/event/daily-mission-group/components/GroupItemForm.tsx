import i18next from "@/i18n/i18n";
import { CSSProperties } from 'react'
import { MissionCouponGroupItem } from '../MissionGroupForm'
import { Col, Divider, Form, InputNumber, Row } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { Select } from 'antd/lib';
import { GroupItemType } from '../Options';
import GroupItemNameSelect from './GroupItemNameSelect';
import { getMissionCouponNameListAPI } from '@/api/daily-mission/mission-coupon/get';
import { useParams } from 'react-router-dom';
// import CommaNumber from '@/components/CommaNumber';

interface FormData {
  items: MissionCouponGroupItem[];
}

const MissionTypeOption: DefaultOptionType[] = [
  { label: i18next.t("mission.liveBet"), value: 'liveBetting' },
  { label: i18next.t("mission.slotBet"), value: 'slotBetting' },
  { label: i18next.t("mission.sportsBet"), value: 'sportsBetting' },
  { label: i18next.t("mission.minigameBet"), value: 'minigameBetting' },
  { label: i18next.t("mission.virtualSportsBet"), value: 'virtualSportsBetting' },
  { label: i18next.t("mission.fishingBet"), value: 'fishBetting' },
  { label: i18next.t("mission.combinedBet"), value: 'comprehensiveBetting' },
  { label: i18next.t("col.deposit"), value: 'deposit' },
  { label: i18next.t("mission.manual"), value: 'manual' },
];

interface Props {
  initialValue:  MissionCouponGroupItem[];
  handleDelete: (field: MissionCouponGroupItem) => void;
}

const colStyle: CSSProperties = {
  // borderBottom: '1px solid var(--ant-color-border-secondary)',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  // height: '100%'
}
const formItemStyle: CSSProperties = {
  margin: 0
  // height: '100%'
}

const GroupItemForm = ({initialValue}: Props) => {
  const {id} = useParams();
  const form = Form.useFormInstance<FormData>();
  const itemArray = Form.useWatch("items", form);
  const { swr: {data: missionNameList, isLoading: missionNameListLoading } } = getMissionCouponNameListAPI('mission');
  const { swr: {data: couponNameList, isLoading: couponNameListLoading } } = getMissionCouponNameListAPI('coupon');
  const displayOrderOptions = itemArray && Array(itemArray.length/2)
  .fill(null)
  .map((_item, index) => ({label: index+1, value: index+1}))
  .filter(item => !itemArray.flatMap(item => item.item_order).includes(item.value))
    
  return (
      <Form.List name="items" initialValue={initialValue}>
        {(fields) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row gutter={[16, 16]} align={'stretch'}>
                {id && (
                  <Form.Item 
                    label={'ID'}
                    name={[name, 'id']}
                    hidden
                  >
                    <InputNumber controls={false} size="small" style={{width: '100%'}} type="hidden"/>
                  </Form.Item>
                )}
                <Col span={4} style={colStyle}>
                  <Form.Item 
                    {...restField}
                    label={i18next.t("col.type")}
                    name={[name, 'item_type']}
                    rules={[{ required: true }]}
                    style={formItemStyle}
                  >
                    <Select size='small' options={GroupItemType} style={{width: '100%'}} disabled />
                  </Form.Item>
                </Col>
                <Col span={6} style={colStyle}>
                  <GroupItemNameSelect
                    itemArray={itemArray}
                    missionNameList={missionNameList}
                    couponNameList={couponNameList}
                    isLoading={couponNameListLoading || missionNameListLoading}
                    restField={restField} 
                    label={i18next.t("col.name")} 
                    fieldName={[name, 'item_name']} 
                    index={name} 
                    style={formItemStyle} 
                    required 
                    // hasManagement 
                    disabled={(itemArray && itemArray.length > 0 && itemArray[name].id) ? true : false}
                  />
                </Col>
                {itemArray && itemArray[name] && itemArray[name].item_type === 'mission' && (
                <Col span={4} style={colStyle}>
                  <Form.Item 
                    label={i18next.t("event.missionType")}
                    name={[name, 'item_mission_type']}
                    rules={[{ required: true }]}
                    style={formItemStyle}
                  >
                    <Select size='small' options={MissionTypeOption} style={{width: '100%'}} labelInValue allowClear disabled={(itemArray && itemArray.length > 0 && itemArray[name].id) ? true : false} />
                  </Form.Item>
                </Col>
                 )}
                <Col span={4} style={colStyle}>
                  <Form.Item 
                    label={i18next.t("col.amount")}
                    name={[name, 'item_amount']}
                    rules={[{ required: true }]}
                    style={formItemStyle}
                  >
                    <InputNumber controls={false} size="small" style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                {itemArray && itemArray[name] && itemArray[name].item_type === 'coupon' && (
                  <Col span={4} style={colStyle}>
                      <Form.Item 
                        label={i18next.t("mission.couponPayoutOrder")}
                        name={[name, 'item_order']}
                        rules={[{ required: true }]}
                        style={formItemStyle}
                      >
                        <Select 
                          size="small" 
                          options={displayOrderOptions} 
                          style={{width: '100%'}}  
                          allowClear
                        />
                      </Form.Item>
                    {/* <Form.Item 
                      label={'백분율'}
                      name={[name, 'item_percentage']}
                      rules={[{ required: true }]}
                      style={formItemStyle}
                      >
                      <InputNumber suffix="%" controls={false} size="small" min={0} max={100} style={{width: '100%'}} />
                      </Form.Item> */}
                  </Col>
                )}
                {/* {itemArray && itemArray[name] && itemArray[name].item_type === 'mission' && (
                  <Col span={2} style={{display: 'flex'}}>
                    <div className="" style={{margin: 'auto 0 auto 0', fontSize: '14px'}}>
                      <div className="">&nbsp;</div>
                      <div className="">
                      {name < Math.ceil(fields.length / 2) ? (
                        <CommaNumber 
                          value={name === Math.ceil(fields.length / 2) - 1 
                            ? 100 - Math.floor(100 / (fields.length / 2)) * (Math.ceil(fields.length / 2) - 1) 
                            : Math.floor(100 / (fields.length / 2))
                          } 
                          isPercentage 
                        />
                      ) : null}
                      </div>
                    </div>
                  </Col>
                )} */}
                {/* <Col span={2} style={{display: 'flex'}}>
                  <MinusCircleOutlined onClick={() => {
                    if (id) {
                      const toDelete = form.getFieldValue(`items`)
                      console.log(toDelete)
                      console.log(key, name)
                      handleDelete(toDelete[name]);
                    }
                    remove(name);
                  }} style={{margin: 'auto 0 auto 0', fontSize: '16px'}} />
                </Col> */}
              
                {(name+1) === (fields.length / 2) && (
                  <Divider />
                )}
              </Row>
            ))}
            {/* <Form.Item style={{marginTop: '1rem'}}>
              <Button shape='circle' icon={<PlusCircleOutlined />} onClick={() => {
                add({ item_type: 'mission', item_name: '', item_amount: 0, item_percentage: 0 });
                add({ item_type: 'coupon', item_name: '', item_amount: 0, item_percentage: 0 });
              }} />
            </Form.Item> */}
          </>
        )}
      </Form.List>
  )
}

export default GroupItemForm