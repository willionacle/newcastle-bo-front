import { useContext, useEffect, useRef, useState } from "react";
import { EditableCellProps } from "./types";
import { DatePicker, Form, Input, InputNumber, InputRef } from "antd";
import { EditableContext } from "./context";
import dayjs from "dayjs";

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    dataType,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;
  
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        console.log('INPUT REF', inputRef)
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const handleDateChange = (dataindex: EditableCellProps['dataIndex'], date: string | number) => {
        console.log(dataindex, dayjs(date).toISOString());
        form.setFieldValue(dataIndex, date);
        setEditing(!editing);
        save();
    }
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        console.log('saving values', values)

        toggleEdit();
        handleSave({...record, ...values,});
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} is required.` }]}
        >
            {
            dataIndex.toString().includes('date') ? 
                <DatePicker ref={() => inputRef} defaultValue={record[`${dataIndex.toString().includes('date') ? dataIndex : null}`]} format={'YYYY-MM-DD'} onChange={(date) => handleDateChange(dataIndex, date)} /> :
            dataIndex.toString().includes('number') || dataIndex.toString().includes('amount') || dataIndex.toString().includes('total') || dataIndex.toString().includes('point') || dataIndex.toString().includes('count') ?
                <InputNumber ref={() => inputRef} 
                    formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    } 
                    onPressEnter={save} 
                    onBlur={save} 
                    style={{width: '100%'}} 
                /> :
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            }
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };

  export default EditableCell;