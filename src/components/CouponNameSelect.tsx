import { couponNameAPI, CouponNameData } from "@/api/coupon-name/get";
import { CouponUpdateBody, createCouponName, updateCouponName } from "@/api/coupon-name/post";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, InputRef, notification, Select, SelectProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { deleteCouponName } from "@/api/coupon-name/delete";
import { FlattenOptionData } from "rc-select/lib/interface";
import { BaseOptionType, DefaultOptionType } from "antd/es/select";
import { CouponData } from "@/api/coupon/get";

interface Props {
  label?: string;
  required?: boolean;
  hasManagement?: boolean;
}

const CouponNameSelect = ({ label, required, hasManagement }: Props) => {
  const form = Form.useFormInstance()
  const { swr: {data, isLoading, mutate} } = couponNameAPI();
  const [name, setName] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [isEditingIndex, setEditingIndex] = useState<number>()
  const inputRef = useRef<InputRef>(null);
  const updateInputRef = useRef<InputRef>(null);

  const options: SelectProps["options"] = data && data.data ? data?.data.map((item: CouponNameData) => ({
    label: item.name,
    value: item.id,
  })) : [];

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onUpdateNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const res = await createCouponName({name: name, coupon_content: ''});
      const {data: {message, code}} = res

      if (code == 0) {
        mutate();
        setName('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        notification.error({message: message})
      }
    } catch (error) {
      console.error(error)
    }
    
  };

  const deleteItem = async (e: React.MouseEvent<HTMLElement, MouseEvent>, option: FlattenOptionData<BaseOptionType>) => {
    e.preventDefault();
    e.stopPropagation();
    option.key
    try {
      const res = await deleteCouponName(option.value as CouponData['id']);
      const {data: {message, code}} = res

      if (code == 0) {
        mutate();
        form.setFieldValue('coupon_name', '')
      } else {
        notification.error({message: message})
      }
    } catch (error) {
      console.error(error)
    }
    
  };
  const handleEditItem = async (e: React.MouseEvent<HTMLElement, MouseEvent>, option: FlattenOptionData<BaseOptionType>) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingIndex(option.key as number)
    setUpdateName(option.label as string)
    form.setFieldValue('coupon_name', '')
    console.log(option.key)
   
    
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
        mutate();
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
    console.log(data?.data)
    if (data && data?.data && e) {
      const content = data?.data.filter((item) => e.value === item.id);
      form.setFieldValue('system_note', content[0].coupon_content);
    } else {
      form.setFieldValue('system_note', '');
    }
  }
  
  useEffect(() => {
    if (isEditingIndex) {
      updateInputRef.current?.focus();
      console.log('INPUT REF', inputRef)
    }
  }, [isEditingIndex]);

  return (
    <Form.Item
      name={["coupon_name"]}
      rules={[{ required: required }]}
      label={label}
    >
      <Select
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
                <Button icon={<EditOutlined />} shape="circle" onClick={(e) => handleEditItem(e, option)} />
                <Button style={{borderWidth: 1, borderColor: 'var(--ant-color-error)'}} type="text" icon={<DeleteOutlined />} danger shape="circle" onClick={(e) => deleteItem(e, option)} />
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
      />
    </Form.Item>
  );
};

export default CouponNameSelect;
