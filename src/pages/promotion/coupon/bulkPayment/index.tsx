import CommaNumber from "@/components/CommaNumber";
import DeleteBtn from "@/components/DeleteBtn";
import EditableCell from "@/components/EditableTable/EditableCell";
import EditableRow from "@/components/EditableTable/EditableRow";
import { GF } from "@/utils/GlobalFunctions";
import { Button, Table } from "antd";
import { TableProps } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    data: DataType[];
    setData: any;
}

export interface DataType {
    key: React.Key;
    username: string;
    coupontitle: string;
    system_memo: string;
    amount: number;
    expired_date: string | Dayjs;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const BulkCouponPayment = ({data, setData}: Props) => {
    const { t } = useTranslation();
    // const [data, setData] = useState<DataType[]>()
    const [count, setCount] = useState(0);

    const handleDelete = (key: React.Key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        setCount(count + 1)
    };

    const handleAdd = () => {
        
        const newData: DataType = {
          key: count + 1,
          username: `ID - ${count + 1}`,
          coupontitle: 'Title',
          system_memo: 'Note',
          amount: 0,
          expired_date: dayjs().tz().startOf("day"),
        };
        setData([...data, newData]);
        setCount(count + 1);
      };

    const handleSave = (row: DataType) => {
        const newData = [...data];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setData(newData);
    };

    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; dataType?: string | null | Date })[] = [
        { 
            title: t("coupon.cp004"), 
            dataIndex: 'username', 
            key: 'username', 
            editable: true,
            width: '16.667%',
        },
        { 
            title: t("coupon.cp008"), 
            dataIndex: 'coupontitle', 
            key: 'coupontitle', 
            editable: true,
            width: '16.667%', 
        },
        { 
            title: t("coupon.cp009"), 
            dataIndex: 'system_memo', 
            key: 'system_memo', 
            editable: true,
            width: '16.667%',
        },
        { 
            title: t("coupon.cp010"), 
            dataIndex: 'amount', 
            key: 'amount', 
            editable: true,
            width: '16.667%',
            render: (value) => (<CommaNumber value={value} onlyNumber />),
        },
        { 
            title: t("couponDetail.cpre001"), 
            dataIndex: 'expired_date', 
            key: 'expired_date', 
            editable: true,
            width: '16.667%',
            render: (value) => GF.formatDate(dayjs(value).toISOString(), false),
        },
        {
        title: t("global.action"),
        dataIndex: 'operation',
        width: '16.667%',
        render: (_, record) =>
            data.length >= 1 ? (
            <DeleteBtn
                handleDelete={() => handleDelete(record.key)}
            />
            ) : null,
        },
    ];

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: DataType) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
    });

    useEffect(() => {
        // if (data) setCount(data.length + 1);
        console.log('COUNT',count)
    }, [data])

    return (
        <>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                신규추가
            </Button>
            <Table<DataType>
                components={components}
                rowClassName={() => 'editable-row'}
                dataSource={data}
                columns={columns as ColumnTypes}
                rowKey={"username"}
                pagination={false}
            />
        </>
    )
}

export default BulkCouponPayment;