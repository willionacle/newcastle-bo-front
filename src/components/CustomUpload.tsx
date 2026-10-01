import { PlusOutlined } from "@ant-design/icons"
import { Form, notification, Upload } from "antd"
import { RcFile } from "antd/es/upload"
import { UploadProps } from "antd/lib"
import { useState } from "react"
import { UPLOAD_ACCEPT, uploadErrorMessage, uploadFileAPI } from "@/api/upload/post"

interface UploadComponentProps {
    type: keyof FilenameRes
    /** Picker filter — defaults to what media-api accepts (see UPLOAD_ACCEPT). */
    accept?: string
}

interface FilenameRes {
    image: string,
    thumbnail: string,
    imageDesktop: string,
    imageMobile: string,
    reg_excel: string,
    game_image: string,
}

const CustomUpload: React.FC<UploadComponentProps> = ({type, accept = UPLOAD_ACCEPT}) => {
    const [file, setFile] = useState<string | Blob | RcFile | undefined>("");
    const form = Form.useFormInstance();

    const handleCustomRequest: UploadProps["customRequest"] = async (option) => {
        const { onSuccess, onError, onProgress, file, filename } = option;

        const formData = new FormData();
        formData.append(`${filename}`, file as RcFile);

        try {
            const response = await uploadFileAPI(formData, (event) => {
                if (onProgress && event.total) {
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                }
            });

            if (onSuccess) {
                setFile(file)
                onSuccess(response.data);
                form.setFieldValue(type, response.data.filenames);
            }
        } catch (error: any) {
            if (onError) {
                onError(error);
            }
            notification.error({message: uploadErrorMessage(error)});
        }
    };

    const handleUploadChange: UploadProps["onChange"] = (info) => {
        if (info.fileList.length > 1) {
            const index = info.fileList.findIndex((item) => item.uid === info.file.uid);

            if (index > -1) {
                info.fileList.splice(index, 1);
            }
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      );

    return (
        <Upload
            customRequest={handleCustomRequest}
            onChange={handleUploadChange}
            accept={accept}
            listType="picture-card"
            showUploadList={{ previewIcon: true }}
            name="files"
            onRemove={() => setFile('')}
        >
            {file === "" && uploadButton}
        </Upload>
    )

}

export default CustomUpload
