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

export const plainOptions = [

    { label: i18next.t("col.deposit"), value: "보유금 입금" }, // Deposit
    { label: i18next.t("topNavi.tn016"), value: "보유금 출금" }, // Withdrawal
    { label: i18next.t("col.bet"), value: "베팅" }, // Betting
    { label: i18next.t("moneyType.betWin"), value: "베팅결과" }, // Betting Win
    { label: i18next.t("moneyType.rollingConvert"), value: "롤링포인트전환" }, // Rolling conversion
    { label: i18next.t("moneyType.couponConvert"), value: "쿠폰전환" }, // Coupon conversion
    { label: i18next.t("moneyType.adminAdjust"), value: "유저 증감" }, // Management increase/decrease
    { label: i18next.t("moneyType.betCancel"), value: "베팅취소" }, // Betting cancellation
    { label: i18next.t("moneyType.paybackConvert"), value: "페이백포인트전환" }, // Payback conversion
    { label: i18next.t("moneyType.referralPointConvert"), value: "추천포인트전환" }, // Recommended point conversion
    // { label: "머니이동", value: "머니이동" }, // Money Transfer
    
    // { label: "입금", value: "입금" }, // Deposit
    // { label: "출금", value: "출금" }, // Withdrawal
    // { label: "베팅", value: "베팅" }, // Betting
    // { label: "베팅당첨", value: "베팅당첨" }, // Betting Win
    // { label: "롤링전환", value: "롤링전환" }, // Rolling conversion
    // { label: "쿠폰전환", value: "쿠폰전환" }, // Coupon conversion
    // { label: "관리지증감", value: "관리지증감" }, // Management increase/decrease
    // { label: "베팅취소", value: "베팅취소" }, // Betting cancellation
    // { label: "페이백전환", value: "페이백전환" }, // Payback conversion
    // { label: "추천포인트전환", value: "추천포인트전환" }, // Recommended point conversion

     // { label: "베팅", value: "베팅" },
    // { label: "베팅결과", value: "베팅결과" },
    // { label: "베팅취소", value: "베팅취소" },
    // { label: "보유금", value: "보유금" },
    // { label: "보유금 입금", value: "보유금 입금" },
    // { label: "출금", value: "보유금 출금" },
    // { label: "유저 증감", value: "유저 증감" },
    // { label: "출금", value: "출금" },
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
    setCheckedList(form.getFieldValue('type'))
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