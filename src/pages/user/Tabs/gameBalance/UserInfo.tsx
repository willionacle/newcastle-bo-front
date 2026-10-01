import { List,  } from "antd";
import { itemStyle, listItemStyle, listStyle } from "../infomation/UserInfoStyle";
import { getMoneyAPI, moneyTransferAPI, ProviderList } from "@/api/transfer/get";
import { ResUser } from "@/api/types";
import { useEffect, useState } from "react";
import CommaNumber from "@/components/CommaNumber";

interface Props {
  data: ResUser['data'] | undefined;
  loading?: boolean;
}

interface GameBalanceProps {
  pp: number;
  evo: number;
  evoslot: number;
  ag: number;
  esports: number;
  mg: number;
  bng: number;
  dg: number;
  marble: number;
  cq9: number;
  bbin: number;
  fc: number;
  ds: number;
  bota: number;
  jili: number;
  jdb: number;
  betgames: number;
  aesexy: number;
  wmlive: number;
  welive: number;
  hw: number;
  dgs: number;
  gdslot: number;
  pg: number;
  yblive: number;
  obslot: number;
  obesport: number;
}


const UserGameBalance = ({ data }: Props) => {
  const {
    username = '',
  } = data ?? {};
  const {gameMoneyData, isLoading} = getMoneyAPI(username);
  const {providerList, providerLoading} = moneyTransferAPI(username);
  const [list, setList]= useState<ProviderList[]>();
  const [gameBalance, setGameBalance]= useState<GameBalanceProps>({
    pp: 0,
    evo: 0,
    evoslot: 0,
    ag: 0,
    esports: 0,
    mg: 0,
    bng: 0,
    dg: 0,
    marble: 0,
    cq9: 0,
    bbin: 0,
    fc: 0,
    ds: 0,
    bota: 0,
    jili: 0,
    jdb: 0,
    betgames: 0,
    aesexy: 0,
    wmlive: 0,
    welive: 0,
    hw: 0,
    dgs: 0,
    gdslot: 0,
    pg: 0,
    yblive: 0,
    obslot: 0,
    obesport: 0,
  });

  const insertBalance = () => {
    if (providerList && providerList.length > 0) {
      console.log(gameBalance)
      const newProviders: ProviderList[] = [];
      providerList.map((item) => {
        newProviders.push({
          ...item,
          //@ts-ignore
          balance: gameBalance[item.value]
        });
      });
      setList(newProviders);
    }
  };

  useEffect(() => {

    if (!isLoading && gameMoneyData) {
      const balanceKeys = Object.keys(gameBalance)
      const newBal = balanceKeys.reduce((acc, key, index) => {
        //@ts-ignore
        acc[key] = gameMoneyData[index].data.data.balance;
        return acc
      }, {...gameBalance});
      setGameBalance(newBal)
      console.log('new balance', newBal)
    }

  }, [gameMoneyData])

  useEffect(() => {
    if (gameBalance && !isLoading) {
      insertBalance()
    }
    console.log(providerList)
  }, [gameBalance])

  return (
    <>
      <List
        loading={isLoading || providerLoading}
        style={listStyle}
        grid={{ column: 2, gutter: 0 }}
        dataSource={list ?? []}
        renderItem={(item) => (
          <List.Item key={item.id} style={listItemStyle}>
            <div style={itemStyle(true)}>{item.title}</div>
            <div style={itemStyle()}><CommaNumber value={item.balance} /></div>
          </List.Item>
        )}
      />
    </>
  );
};

export default UserGameBalance;
