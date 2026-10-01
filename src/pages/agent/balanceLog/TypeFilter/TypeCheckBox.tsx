import i18next from "@/i18n/i18n";
import React, { useEffect, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import type { CheckboxProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

const CheckboxGroup = Checkbox.Group;

// 베팅 Betting
// 베팅결과 Betting result
// 베팅취소 Betting cancellation
// 보유금 Savings
// 보유금 입금 Deposit of savings
// 보유금 출금 Withdrawal of savings
// 유저 증감 User increase/decrease
// 출금 Withdrawal

const plainOptions = [
  { "label": i18next.t("col.all"), "value": "전체" },
  { "label": i18next.t("agent.al050"), "value": "커미션출금" },
  { "label": i18next.t("moneyType.upperPay"), "value": "상부지급" },
  { "label": i18next.t("moneyType.subDistributorPay"), "value": "하부총판지급" },
  { "label": i18next.t("moneyType.subDistributorRecover"), "value": "하부총판회수" },
  { "label": i18next.t("moneyType.memberPay"), "value": "소속유저지급" },
  { "label": i18next.t("moneyType.memberRecover"), "value": "소속유저회수" },
  { "label": i18next.t("moneyType.memberCouponPay"), "value": "소속유저쿠폰지급" },
  { "label": i18next.t("moneyType.rollingCommissionConvert"), "value": "롤링커미션전환" },
  { "label": i18next.t("moneyType.losingCommissionConvert"), "value": "루징커미션전환" }
];

const TypeCheckBox: React.FC = () => {
    const form = useFormInstance()
  const [checkedList, setCheckedList] = useState(form.getFieldValue('type'));
  const [mtChecked, setmtChecked]= useState(false)

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    form.setFieldValue('type', list);
    setmtChecked(false);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? plainOptions.map((item) =>  {return item.value}) : []);
    form.setFieldValue('type', e.target.checked ? plainOptions.map((item) =>  {return item.value}) : []);
    setmtChecked(false);
  };
  // const onMTCheckChange: CheckboxProps['onChange'] = (e) => {
  //   console.log(e)
  //   setCheckedList([]);
  //   form.setFieldValue('type', ['']);
  //   setmtChecked(e.target.checked);
  //   if (e.target.checked) {
  //     form.setFieldValue('system_note', e.target.value);
  //   } else {
  //     form.setFieldValue('system_note', '');
  //   }
  // };

  useEffect(() => {
    setCheckedList(form.getFieldValue('type') ?? [''])
  }, []);

  useEffect(() => {
    if (!mtChecked) {
      form.setFieldValue('system_note', '');
    }
  }, [mtChecked])

  return (
    <>
      <div>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {i18next.t("col.all")}
        </Checkbox>
        {/* <Checkbox onChange={onMTCheckChange} value={'머니이동'} checked={mtChecked}>
          머니이동
        </Checkbox> */}
      </div>
      <Divider style={{margin: '6px auto'}} />
      <CheckboxGroup className='typeCheckBox' options={plainOptions} value={checkedList} onChange={onChange} />
    </>
  );
};

export default TypeCheckBox;