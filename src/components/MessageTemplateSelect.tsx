import i18next from "@/i18n/i18n";
import { getMessageTemplateListAPI, MessageTemplateData } from "@/api/message-template/get";
import { EditOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Select, SelectProps } from "antd"
import { BaseOptionType, DefaultOptionType } from "antd/es/select";
import { FlattenOptionData } from "rc-select/lib/interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const MessageTemplateSelect = ({
    messageFormName, 
    titleFormName, 
    label = i18next.t("sidemenu.sm073"),
    name = "message_template", 
    required = false,
    hasManagement = true,
    handleSetContent,
    editor,
  }: {
    messageFormName: string, 
    titleFormName: string, 
    handleSetContent?: (content: any) => void, 
    label?: string,
    editor?: any,
    name?: string, 
    required?: boolean 
    hasManagement?: boolean 
  }) => {
  const form = Form.useFormInstance();
  const {swr} = getMessageTemplateListAPI({limit: 5000});
  const navigate = useNavigate();
  const [active, setActive]= useState(false);

  const options: SelectProps["options"] = swr.data && swr.data.data ? swr.data?.data.map((item: MessageTemplateData) => ({
      label: item.title,
      value: item.message,
      id: item.id
    })) : [
    // {label: "Test Title", value: "Test Content", id: 0},
    // {label: "Test Title 1", value: "Test Content 1", id: 1},
  ];

  const handleChange = (e: DefaultOptionType, option: DefaultOptionType | DefaultOptionType[]) => {
    const newOption = option as unknown as DefaultOptionType;
    console.log('NEW OPTION', newOption)
    form.setFieldValue(messageFormName, e);
    form.setFieldValue(titleFormName, newOption.label);
    console.log(e, option)
    if (handleSetContent && editor) {
      
      let content = undefined;
      try {
        content = JSON.parse(e as any);
        handleSetContent(content)
      } catch (error) {
        const point = { path: [0, 0], offset: 0 }
        editor.selection = { anchor: point, focus: point };
        editor.history = { redos: [], undos: [] }; 
        editor.children = [{
            type: "paragraph",
            children: [{ text: "" }]
        }];
        handleSetContent([{
            type: "paragraph",
            children: [{ text: "" }]
        }])
        console.error(error)
      }
    }
  }

  const handleEditItem = (e: React.MouseEvent<HTMLElement, MouseEvent>, option: FlattenOptionData<BaseOptionType>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = option;
      const { id } = data
      navigate(`/system/message-template/edit/${id}`);
    } catch {}
  }


  const handleAdd = () => {
    navigate("/system/message-template/create");
  }

  return (
    <Form.Item
      name={[name]}
      rules={[{ required: required }]}
      label={label}
    >
      <Select

        onClear={() => {
          const val = JSON.stringify([{
            type: "paragraph",
            children: [{ text: "" }]
        }]) as unknown as DefaultOptionType;
        const option = {label: "", value: ""};
          handleChange(val, option);
        }}
        options={options}
        onChange={(value, option) => handleChange(value, option)}
        loading={swr.isLoading}
        optionRender={hasManagement ? (option) => (
          <Flex align="center" gap={6}>
            <div style={{flex: 1}}>{option.label}</div>
            <Button icon={<EditOutlined />} shape="circle" onClick={(e) => handleEditItem(e, option)} />
          </Flex>
        ) : undefined}
        dropdownRender={hasManagement ? (menu) => (
          <>
          {menu}
          <div 
            className={`ant-select-item ant-select-item-option ${active ? "ant-select-item-option-active" : ""}`} 
            title="Add"
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
          >
            <div className="ant-select-item-option-content">
              <div className="ant-flex css-var-r1 ant-flex-align-center" style={{gap: "6px"}}>
                <div role="option" style={{flex: "1 1 0%", fontWeight: 'bold'}} onClick={handleAdd}>{i18next.t("text.registerMessageTemplate")}</div>
              </div>
            </div>
          </div>
          </>
        ) : undefined}
        allowClear
      />
    </Form.Item>
  )
}

export default MessageTemplateSelect;