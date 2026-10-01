import { CouponUpdateBody, 
  updateCouponName } from "@/api/coupon-name/post";
import { 
  PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, InputRef, notification, Select,
} from "antd";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { FlattenOptionData } from "rc-select/lib/interface";
import { BaseOptionType, DefaultOptionType } from "antd/es/select";
import { MissionCouponGroupItem } from "../MissionGroupForm";
import { SWRType } from "@/api/types";

interface Props {
  itemArray: MissionCouponGroupItem[];
  missionNameList: SWRType<MissionCouponGroupItem[]> | undefined;
  couponNameList: SWRType<MissionCouponGroupItem[]> | undefined;
  isLoading: boolean
  index: number;
  restField: { fieldKey?: number | undefined; };
  label?: string;
  required?: boolean;
  hasManagement?: boolean;
  fieldName: any;
  style: CSSProperties;
  disabled?: boolean;
}

const GroupItemNameSelect = ({ label, required, hasManagement, fieldName, restField, index, style, missionNameList, couponNameList, isLoading, itemArray, disabled }: Props) => {
  const form = Form.useFormInstance()
  const type = Form.useWatch(["items", index, "item_type"], form);
  const [name, setName] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [isEditingIndex, setEditingIndex] = useState<number>();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const inputRef = useRef<InputRef>(null);
  const updateInputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onUpdateNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    console.log(name)
    const nameExist = itemArray.some(item => {
      if (item && item.item_name) {
        const itemName = item.item_name as unknown as DefaultOptionType
        return itemName.label === name
      }
    });
    const newOptions = [...options, {label: name, value: null}];
    console.log(nameExist)
    if(!nameExist) {
      setOptions(newOptions);
      setName('');
    } else {
      notification.error({message: 'Name already exist!'})
    }
    
  };

  const handleUpdateItemSave = async (option: FlattenOptionData<BaseOptionType>) => {
    try {
      const reqBody: CouponUpdateBody = {
        id: option.value as number,
        name: updateName,
        coupon_content: '',
        is_active: 1
      }
      const res = await updateCouponName(reqBody);
      const {data: {message, code}} = res

      if (code == 0) {
        handleCancelUpdateItem();
      } else {
        notification.error({message: message})
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelUpdateItem = () => {
    setEditingIndex(undefined);
    setUpdateName('')
    form.setFieldValue('coupon_name', '')
  }

  const handleChange = (e: DefaultOptionType) => {
    const data = type === 'mission' ? missionNameList : couponNameList

    if (data && data?.data && e) {
      const nameItem = data?.data.find((item) => e.value === item.item_id);

      // console.log(data?.data)
      const fieldsValue = form.getFieldsValue();
      if (type === 'mission') {
        const itemMissionType = nameItem?.item_mission_type;
        const itemFunction = nameItem?.item_function;
        fieldsValue.items[index]['item_mission_type'] = {label: itemMissionType, value: itemFunction};
      }
      fieldsValue.items[index]['item_amount'] = nameItem?.item_amount;
      fieldsValue.items[index]['item_percentage'] = nameItem?.item_percentage;
      form.setFieldsValue(fieldsValue);

      // form.setFieldValue('system_note', content[0].coupon_content);
    } else {
      // form.setFieldValue('system_note', '');
    }
  }
  
  useEffect(() => {
    if (isEditingIndex) {
      updateInputRef.current?.focus();
      console.log('INPUT REF', inputRef)
    }
  }, [isEditingIndex]);

  useEffect(() => {
    const selectedMissionCouponName = itemArray && itemArray.flatMap(item => {
        if (item && item.item_name) {
          const itemName = item.item_name as unknown as DefaultOptionType;
          return itemName.label;
        } else {
          return undefined
        }
    });

    const newMissionNameList = missionNameList && missionNameList?.data?.filter(item => selectedMissionCouponName && !selectedMissionCouponName.includes(item.item_name))
    const newCouponNameList = couponNameList && couponNameList?.data?.filter(item => selectedMissionCouponName &&!selectedMissionCouponName.includes(item.item_name))

    const data = type ? type === 'mission' ? newMissionNameList : newCouponNameList : [];

    if (data) {
      const newOptions = data.map((item: MissionCouponGroupItem) => ({
        label: item.item_name,
        value: item.item_id,
      }));

      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  }, [type, missionNameList, couponNameList, itemArray])

  return (
    <Form.Item
      {...restField}
      name={fieldName}
      rules={[{ required: required }]}
      label={label}
      style={style}
    >
      <Select
        disabled={!type || disabled}
        labelInValue
        showSearch
        // notFoundContent="검색 단어 입력 후 엔터"
        options={options}
        loading={isLoading}
        optionFilterProp="label"
        filterOption={true}
        optionRender={hasManagement ? (option) => (
          <Flex align="center" gap={6}>
            {isEditingIndex !== option.key? (
              <>
                <div style={{flex: 1}}>{option.label}</div>
                {/* <Button icon={<EditOutlined />} shape="circle" onClick={(e) => handleEditItem(e, option)} /> */}
                {/* <Button style={{borderWidth: 1, borderColor: 'var(--ant-color-error)'}} type="text" icon={<DeleteOutlined />} danger shape="circle" onClick={(e) => deleteItem(e, option)} /> */}
              </>
            ): (
              <Form.Item
                style={{ margin: 0, flex: 1 }}
                name={option.key}
                rules={[{ required: true, message: `This field is required.`}]}
              >
                <Input
                  placeholder={option.label as string}
                  ref={updateInputRef}
                  value={updateName}
                  onChange={onUpdateNameChange}
                  onPressEnter={() => handleUpdateItemSave(option)}
                  onBlur={handleCancelUpdateItem}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{width: "100%"}}
                />
              </Form.Item>
            )}
          </Flex>
        ) : undefined}
        dropdownRender={hasManagement ? (menu) => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Flex style={{ padding: '0 8px 4px'}}>
              <Input
                placeholder="Please enter item"
                ref={inputRef}
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
                style={{width: "100%"}}
              />
              <Button type="text" icon={<PlusOutlined />} onClick={addItem} >
                신규추가
              </Button>
            </Flex>
          </>
        ) : undefined}
        allowClear
        onChange={handleChange}
        size='small'
      />
    </Form.Item>
  );
};

export default GroupItemNameSelect;
