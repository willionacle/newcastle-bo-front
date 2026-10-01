import { InboxOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadProps } from "antd/lib";
import Dragger from "antd/lib/upload/Dragger";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Papa from "papaparse";

interface Props {
  data: any[] | any |undefined;
  setData: Dispatch<SetStateAction<any | undefined>>;
  disabled?: boolean;
}

const CSVFileParser = ({data, setData, disabled}: Props) => {
    const [isParsing, setIsParsing] = useState(false)


    const handleBeforeUpload = (file: File) => {
        if (file.type !== 'text/csv') {
            notification.error({message: `${file.name} is not a CSV File.`})
            return false
        }
    }

    const handleCustomRequest: UploadProps['customRequest'] = async (option) => {
        const { onSuccess, onError, file, filename } = option
        if (!file) return;
        setData([]);
        setIsParsing(true)
        const csvFile = file as RcFile;

        Papa.parse(csvFile, {
            // header: true,
            delimiter: ',',
            skipEmptyLines: true,
            dynamicTyping: true, 
            step: (results) => {
              const {data} = results;
              const rowData = (data as string[])[0]
              setData((prev: any) => [...prev, rowData]);
              console.log('steps', rowData)
            },
            complete: (result) => {
                console.log(result)
                if (onSuccess) {
                    onSuccess(result);
                }
                setIsParsing(false)
            },
            error: (error) => {
                if (onError) {
                    onError(error)
                }
                console.error(error);
                notification.error({message: `Error uploading ${filename} - ${error}`});
            }
        })
            
    }

  useEffect(() => {
    if (data) {
        console.log('DATA',data)
    }
  }, [data])

return (
    <Dragger 
        name="csv_file" 
        customRequest={(option) => handleCustomRequest(option)} 
        beforeUpload={handleBeforeUpload} 
        disabled={isParsing || disabled}
        style={{marginBottom: '1rem'}}
        accept=".csv"
        multiple={false}
        showUploadList={false}
    >
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
            Only CSV files are supported.
        </p>
    </Dragger>
)
};

export default CSVFileParser;
