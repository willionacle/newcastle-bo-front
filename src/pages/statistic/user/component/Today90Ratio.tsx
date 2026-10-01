
import { UserDailyStatsData } from '@/api/cs-statics/user-daily-stats';
import Percentage from '@/components/Percentage';

interface Props {
    today: number;
    past90: number;
    record: UserDailyStatsData;
}

const Today90Ratio = ({today, past90, record}: Props) => {
    let val1 = today;
    let val2 = past90;
    const {depost_sum, bet_sum, deposit_sum_90, bet_sum_90} = record;
    if (val1) {
      if (val1 > 100 || val1 < -100) {
        val1 = 0;
      } else {
        val1 = val1 * 100;
        val1 = val1 > 0 && val1 < 1 ? 1 : val1;
      }
    } else {
      val1 = 0;
    }

    if (val2) {
      if (val2 > 100 || val2 < -100) {
        val2 = 0;
      } else {
        val2 = val2 * 100;
        val2 = val2 > 0 && val2 < 1 ? 1 : val2;
      }
    } else {
      val2 = 0;
    }

    return (
      <div style={{minWidth: '50px'}}>
        {bet_sum > 0 && depost_sum <= 0 ? "-" : depost_sum > 0 && bet_sum < 0 ? "0" : <Percentage value={val1} suffix={val1 !== 0 ? "%" : ' '} onlyNumber />}
        {bet_sum_90 > 0 && deposit_sum_90 <= 0 ? "-" : deposit_sum_90 > 0 && bet_sum_90 < 0 ? "0" : <Percentage value={val2} suffix={val2 !== 0 ? "%" : ' '} onlyNumber  />}
      </div>
    )
}

export default Today90Ratio;