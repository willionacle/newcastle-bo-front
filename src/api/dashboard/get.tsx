import useUserStore from "@/store/user.store";
import instance from "../axios";
import useSWR from "swr";
import { AxiosResponse } from "axios";
import { SWRType } from "../types";

export interface ChartTableData  {
  "month": string;
  "total_deposit": number;
  "total_bonus": number;
  "bonus_percent": number;
  "total_rolling_point": number;
  "rolling_percent": number;
  "total_coupon": number;
  "coupon_percent": number;
}
export interface BettingAmountChartData  {
  "regdate": string;
  "total_live_bet_today": number;
  "total_live_user_today": number;
  "total_slot_bet_today": number;
  "total_slot_user_today": number;
  "total_sports_bet_today": number;
  "total_sports_user_today": number;
  "total_minigame_bet_today": number;
  "total_minigame_user_today": number;
  "total_fish_bet_today": number;
  "total_fish_user_today": number;
  "total_esports_bet_today": number;
  "total_esports_user_today": number;
}
export interface DepostiBettingChartData  {
  "regdate": string;
  "deposit": number;
  "deposit_withdrawal": number;
  "betting_amount": number;
  "betting_winlose": number;
}

export interface UserBettorChartData  {
  "date": string;
  "grade_1_with_bet": number;
  "grade_1_no_bet": number;
  "grade_2_with_bet": number;
  "grade_2_no_bet": number;
  "grade_3_with_bet": number;
  "grade_3_no_bet": number;
  "grade_4_with_bet": number;
  "grade_4_no_bet": number;
  "grade_5_with_bet": number;
  "grade_5_no_bet": number;
  "grade_6_with_bet": number;
  "grade_6_no_bet": number;
  "grade_7_with_bet": number;
  "grade_7_no_bet": number;
}

export interface DailyUserChartData  {
  "regdate": string;
  "today_users": number;
  "depositors": number;
  "new_users": number;
}
export interface DailyUserUniqueChartData  {
  "date": string;
  "unique_users": number;
  "today_betting_users": number;
  "today_deposit_users": number;
  "new_user_count": number;
}
export interface PaybackChartData  {
  "date": string;
  "total_amount": number;
  "total_user": number;
}
export interface PaybackGradeChartData  {
  "date": string;
  "total_amount": number;
  "total_user": number;
  "black_diamond": number;
  "diamond": number;
  "ruby": number;
  "emerald": number;
  "gold": number;
  "silver": number;
  "bronze": number;
  "avg_black_diamond": number;
  "avg_diamond": number;
  "avg_ruby": number;
  "avg_emerald": number;
  "avg_gold": number;
  "avg_silver": number;
  "avg_bronze": number;
}
export interface BettingGradeChartData  {
  "regdate": string;
  "up_date"?: string; // /chartbettinggradedaily rows carry up_date alongside regdate
  "total_bet_amount": number;
  "total_user": number;
  "black_diamond": number;
  "diamond": number;
  "ruby": number;
  "emerald": number;
  "gold": number;
  "silver": number;
  "bronze": number;
  // Present on /chartbettinggradedaily rows only (users who actually placed a bet).
  "total_user_with_bet"?: number;
  "black_diamond_with_bet"?: number;
  "diamond_with_bet"?: number;
  "ruby_with_bet"?: number;
  "emerald_with_bet"?: number;
  "gold_with_bet"?: number;
  "silver_with_bet"?: number;
  "bronze_with_bet"?: number;
  "black_diamond_amount": number;
  "diamond_amount": number;
  "ruby_amount": number;
  "emerald_amount": number;
  "gold_amount": number;
  "silver_amount": number;
  "bronze_amount": number;
}
export interface UserGradeChartData  {
  "date": string;
  "grade_1": number;
  "grade_2": number;
  "grade_3": number;
  "grade_4": number;
  "grade_5": number;
  "grade_6": number;
  "grade_7": number;
}
export interface BonusChartData  {
  "regdate": string;
  "rolling": number;
  "deposit_bonus": number;
  "coupon": number;
  "total_bonus": number;
}
export interface RollingChartData  {
  "regdate": string;
  "total_rolling": number;
  "total_bonus": number;
}
export interface BonusMemberChartData  {
  "regdate": string;
  "deposit_bonus": number;
  "new_user": number;
  "total_bonus": number;
}
export interface CouponMemberChartData  {
  "regdate": string;
  "coupon_sum": number;
  "unique_users": number;
  "total_bonus": number;
}

export const getChartTable = () => {
  const { token, userid } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<ChartTableData[]>>>(
      `${url}`,
      {
        userid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/charttable', fetcher);
};

export const getLineChartBetingAmount = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<BettingAmountChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: now.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartbettingamount', fetcher);
};

export const getLineChartDailyUser = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<DailyUserChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartdailyusers', fetcher);
};

export const getLineChartDailyUserUnique = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<DailyUserUniqueChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: now.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartuniqueusers', fetcher);
};

export const getBarChartDepositBetting = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<DepostiBettingChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: now.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartdepositbetting', fetcher);
};

export const getBarChartUserBettorGrade = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<UserBettorChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: now.toLocaleDateString('en-CA'),
        end_date: now.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartuserbettorgrade', fetcher);
};

export const getLineChartPayback = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<PaybackChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartpayback', fetcher);
};
export const getLineChartBettingGrade = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<BettingGradeChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartbettinggrade', fetcher);
};
export const getLineChartUserGrade = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<UserGradeChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartusergrade', fetcher);
};
export const getLineChartPaybackGrade = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<PaybackGradeChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartpaybackgrade', fetcher);
};

export const getLineChartBonus = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<BonusChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartbonustotal', fetcher);
};

export const getLineChartRolling = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<RollingChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartrollingtotal', fetcher);
};

export const getLineChartBonusMember = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<BonusMemberChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartbonusmember', fetcher);
};

export const getLineChartCouponMember = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<SWRType<CouponMemberChartData[]>>>(
      `${url}`,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };
  
  return useSWR('/chartcouponmember', fetcher);
};

export interface BettingGradeDailyAverage {
  "month_date": string; // YYYY-MM
  "avg_black_diamond": number;
  "avg_black_diamond_amount": number;
  "avg_diamond": number;
  "avg_diamond_amount": number;
  "avg_ruby": number;
  "avg_ruby_amount": number;
  "avg_emerald": number;
  "avg_emerald_amount": number;
  "avg_gold": number;
  "avg_gold_amount": number;
  "avg_silver": number;
  "avg_silver_amount": number;
  "avg_bronze": number;
  "avg_bronze_amount": number;
  "avg_total_user": number;
  "avg_total_bet_amount": number;
  "avg_black_diamond_with_bet": number;
  "avg_diamond_with_bet": number;
  "avg_ruby_with_bet": number;
  "avg_emerald_with_bet": number;
  "avg_gold_with_bet": number;
  "avg_silver_with_bet": number;
  "avg_bronze_with_bet": number;
  "avg_total_user_with_bet": number;
}
export interface BettingGradeDailyTableData extends SWRType<BettingGradeChartData[]> {
  average: BettingGradeDailyAverage[];
}

// Current-month daily betting users by grade + per-month averages.
// Shared by the dashboard daily table and the header screenshot modal (same SWR key -> one request).
export const getBettingGradeDailyTable = () => {
  const { token, userid } = useUserStore.getState();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const fetcher = async (url: string) => {
    const res = await instance.post<undefined, AxiosResponse<BettingGradeDailyTableData>>(
      url,
      {
        userid,
        start_date: firstDayOfMonth.toLocaleDateString('en-CA'),
        end_date: lastDayOfMonth.toLocaleDateString('en-CA'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  return useSWR('/chartbettinggradedaily', fetcher);
};
