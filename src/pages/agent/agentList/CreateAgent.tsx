import { User } from "@/api/users/get";
import UserForm from "@/pages/user/UserForm";
import { Modal } from "antd";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  depth: number;
  agent_id?: User["username"];
}

const CreateAgent = ({ open, setOpen }: Props) => {
  return (
    <Modal
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      destroyOnClose
      open={open}
      onCancel={() => setOpen(false)}
      centered
      width={"80%"}
      styles={{
        content: {
          paddingTop: "3rem",
        },
      }}
    >
      <UserForm />
    </Modal>
  );
};

export default CreateAgent;
