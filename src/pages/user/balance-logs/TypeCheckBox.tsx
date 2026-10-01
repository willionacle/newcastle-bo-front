import i18next from "@/i18n/i18n";
import React, { useEffect, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import type { CheckboxProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

const CheckboxGroup = Checkbox.Group;

export const plainOptions = [
  { label: i18next.t("col.deposit"), value: "보유금 입금" },
  { label: i18next.t("topNavi.tn016"), value: "보유금 출금" },
  { label: i18next.t("moneyType.couponConvert"), value: "쿠폰전환" },
  { label: i18next.t("moneyType.rollingConvert"), value: "롤링전환" },
  { label: i18next.t("moneyType.paybackConvert"), value: "페이백전환" },
  { label: i18next.t("moneyType.referralPointConvert"), value: "추천포인트전환" },
  { label: i18next.t("moneyType.adminAdjust"), value: "관리지증감" },
  { label: i18next.t("col.bet"), value: "베팅" },
  { label: i18next.t("moneyType.betCancel"), value: "베팅취소" },
  { label: i18next.t("moneyType.betWin"), value: "베팅당첨" },
  { label: i18next.t("col.balance"), value: "보유금" },
  { label: i18next.t("moneyType.attendanceBonus"), value: "출석보너스" },
];

// 기본 선택값: 베팅 관련 항목 제외
export const defaultRecordTypes = [
  "보유금 입금",
  "보유금 출금",
  "쿠폰전환",
  "롤링전환",
  "페이백전환",
  "추천포인트전환",
  "관리지증감",
  "보유금",
  "출석보너스"
];

const TypeCheckBox: React.FC = () => {
  const form = useFormInstance();
  const [checkedList, setCheckedList] = useState<string[]>(form.getFieldValue('recordType') || defaultRecordTypes);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    form.setFieldValue('recordType', list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    const allValues = plainOptions.map((item) => item.value);
    setCheckedList(e.target.checked ? allValues : []);
    form.setFieldValue('recordType', e.target.checked ? allValues : []);
  };

  useEffect(() => {
    const currentValue = form.getFieldValue('recordType');
    setCheckedList(currentValue || defaultRecordTypes);
  }, [form]);

  return (
    <>
      <div>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {i18next.t("col.all")}
        </Checkbox>
      </div>
      <Divider style={{ margin: '6px auto' }} />
      <CheckboxGroup
        className='typeCheckBox'
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </>
  );
};

export default TypeCheckBox;
