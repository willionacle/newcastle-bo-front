import { Form, GetRef } from "antd";

export interface EditableRowProps {
    index: number;
}

export type FormInstance<T> = GetRef<typeof Form<T>>;

export interface Item {
    [key: string]: string | number;
}

export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
    dataType: string | number | Date;
}