import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import axios, { AxiosResponse } from "axios";
import { SWRType } from "../types";
import { stringify } from "qs";

export interface GameMoneyDataType {
  [key: string]: number;
}

export const getPPMoneyAPI = (username: string) => {
  const token = useUserStore.getState().token;

  const fetcher = async ([url, username]: [string, string]) => {
    const res = await axios.post(
      url,
      {
        username
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR(
    [`${import.meta.env.VITE_GAMEAPI_URL}/transfer/pp/balance`, username],
    username === "" ? null : fetcher
  );
};

export const getEvoMoneyAPI = (username: string) => {
  const token = useUserStore.getState().token;

  const fetcher = async ([url, username]: [string, string]) => {
    const res = await instance.post(
      url,
      {username},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('evo money', res.data)
    return res.data;
  };

  return useSWR(
    [`${import.meta.env.VITE_GAMEAPI_URL}/transfer/evo_tran/balance`, username],
    username === "" ? null : fetcher
  );
};

export const gfGames = [
  "jili",
  "jdb",
  "betgames",
  "aesexy",
  "wmlive",
  "welive",
  "hw",
  "dgs",
  "gdslot",
  "pg",
  "yblive",
  "obslot",
  "obesport"
];

export const getMoneyAPI = (username: string)=> {
  const token = useUserStore.getState().token;

  const balanceAPI = [
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/pp/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/evo/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/evoslot/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/ag/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/esports/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/mg/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/bng/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/dg/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/marble/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/cq9/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/bbin/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/fc/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/ds/balance`,
      reqBody: {
        username: username
      },
    },
    {
      endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/bota/balance`,
      reqBody: {
        username: username
      },
    },
    ...gfGames.map(item => {
      return {
        endpoint: `${import.meta.env.VITE_GAMEAPI_URL}/transfer/gf/balance`,
        reqBody: {
          username: username,
          vendor: item
        },
      }
    })
  ]; 

  const fetcher = async () => {
    try {
      const results = await Promise.all(
        balanceAPI.map((item) => axios.get(`${item.endpoint}?${stringify(item.reqBody)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }).catch(() => {return {data: {data: {balance: 0}}}})
        )
      );
      
      return results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const {data, isLoading} = useSWR(balanceAPI.map(item => item.endpoint), username ? fetcher : null);

  return {gameMoneyData: data, isLoading}
}

export interface MoneyTransferData {
  title: string;
  value: string;
}

export interface MoneyTransferDataType extends SWRType<MoneyTransferData[]> {
  data2: string[];
}

export interface ProviderList extends MoneyTransferData {
  id: string;
  balance?: number;
}

// const providerToRemove = ['welive', 'allbet', 'obsport', 'hbn', 'pgsoft', 'png']

// const handleTitle = (item: MoneyTransferData) => {
//   let title = item.title

//   switch (item.value) {
//     case 'gdslot':
//       title = 'GD 슬롯';
//       break;
//     case 'obslot':
//       title = 'DB 슬롯';
//       break;
//     case 'yblive':
//       title = 'DB 라이브';
//       break;
//     case 'obesport':
//       title = 'DB E스포츠';
//       break;
  
//     default:
//       break;
//   }

//   return title
// }

export const moneyTransferAPI = (username: string) => {
  const {token} = useUserStore.getState();

  const fetcher = async () => {
    const res = await instance.get<undefined, AxiosResponse<MoneyTransferDataType>>(
      `/moneytransferdropdownlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data.data;
    const sortOrder = res.data.data2;
    
    const sortedData = [...data].sort(
      (a, b) => sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value)
    );
    const newSortedData: ProviderList[] = [];
    sortedData.map(item => {
      if(item.title) {
        // if (!providerToRemove.includes(item.value)) {
          newSortedData.push({
            ...item,
            // title: handleTitle(item),
            id: item.value
          })
        // }
      }
    });
    console.log('new sorted data', newSortedData)
    return newSortedData;
  }

  const {data, isLoading} = useSWR('/moneytransferdropdownlist', username ? fetcher : null);

  return {providerList: data, providerLoading: isLoading}

};