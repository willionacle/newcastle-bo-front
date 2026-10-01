import { Modal } from "antd"
import EditorViewer from "./EditorViewer"
import { useState } from "react"

const CustomWrapText = ({data}: {data: any}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="custom-wrap-text hover-underline" onClick={() => setIsOpen(!isOpen)}>{<EditorViewer data={data}/>}</div>
      <Modal
        open={isOpen}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsOpen(false)}
        width={'60vw'}
      >
        <EditorViewer data={data}/>
      </Modal>
    </>
  )
}

export default CustomWrapText;