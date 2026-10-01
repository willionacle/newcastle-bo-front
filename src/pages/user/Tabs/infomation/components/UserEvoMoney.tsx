import { getEvoMoneyAPI } from "@/api/transfer/get";
import i18next from "@/i18n/i18n";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import EvoMoneyTransferForm from "./EvoMoneyTransferForm";

const UserEvoMoney = ({
  username,
  balance = 0,
}: {
  username: string;
  balance?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [param, setParam] = useState("");
  const { data, isLoading, mutate } = getEvoMoneyAPI(param);

  const handleClick = () => {
    setParam(username);
  };

  return (
    <>
      <Modal
        open={isOpen}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => {setIsOpen(false),mutate()}}
        // width={"60vw"}
        title={i18next.t("title.moneyTransfer")}
      >
        <EvoMoneyTransferForm onSuccess={()=>setIsOpen(false)} username={username} balance={balance} />
      </Modal>
      <Flex gap={5} align="center">
        {!data ? "-" : (data?.data?.balance || 0).toLocaleString()}
        <Button size="small" onClick={handleClick} loading={isLoading}>
          에볼루션 보유금 확인
        </Button>
        <Button
          size="small"
          onClick={() => setIsOpen(true)}
          loading={isLoading}
        >
          머니이동
        </Button>
      </Flex>
    </>
  );
};

export default UserEvoMoney;
