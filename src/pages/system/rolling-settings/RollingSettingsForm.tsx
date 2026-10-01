import i18next from "@/i18n/i18n";
import { getGradeSettings, SettingsData } from "@/api/settings/get";
import { updateRollingSettings } from "@/api/settings/put";
import CSVFileParser from "@/components/CSVFileParser";
import GradeCheckbox from "@/components/GradeCheckbox";
import UserLevelCheckBox from "@/components/UserLevelCheckBox";
import { EditOutlined, SaveOutlined, StopOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Divider, Flex, Form, InputNumber, notification, Radio, Row, Space, Switch, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

export type RollingFormDataProps = Pick<
  SettingsData,
  | "id"
  | "user_list"
  | "rolling_payment_live"
  | "rolling_payment_slot"
  | "rolling_payment_sports"
  | "rolling_payment_minigame"
  | "rolling_payment_fishing"
  | "rolling_payment_board"
  | "rolling_payment_etc"
  | "rolling_target"
  | "rolling_rating_bronze"
  | "rolling_rating_silver"
  | "rolling_rating_gold"
  | "rolling_rating_emerald"
  | "rolling_rating_ruby"
  | "rolling_rating_diamond"
  | "rolling_rating_black_diamond"
  | "rolling_condition_bets_per_day"
  | "rolling_condition_bets_amount_per_day"
  | "rolling_payment_onoff"
  | "rolling_condition_bets_per_day_onoff"
  | "rolling_condition_bets_amount_per_day_onoff"
  | "rolling_rating_level_1"
  | "rolling_rating_level_2"
  | "rolling_rating_level_3"
  | "rolling_rating_level_4"
  | "rolling_rating_level_5"
  | "rolling_rating_level_6"
  | "rolling_rating_level_7"
  | "rolling_rating_level_8"
  | "rolling_rating_level_9"
> & Partial<{
  rollingGrades: number[];
  rollingLevels: number[];
}>;

const grades: { key: keyof SettingsData; value: number }[] = [
  { key: "rolling_rating_bronze", value: 1 },
  { key: "rolling_rating_silver", value: 2 },
  { key: "rolling_rating_gold", value: 3 },
  { key: "rolling_rating_emerald", value: 4 },
  { key: "rolling_rating_ruby", value: 5 },
  { key: "rolling_rating_diamond", value: 6 },
  { key: "rolling_rating_black_diamond", value: 7 },
];

const levels: { key: keyof SettingsData; value: number }[] = [
  { key: "rolling_rating_level_1", value: 1 },
  { key: "rolling_rating_level_2", value: 2 },
  { key: "rolling_rating_level_3", value: 3 },
  { key: "rolling_rating_level_4", value: 4 },
  { key: "rolling_rating_level_5", value: 5 },
  { key: "rolling_rating_level_6", value: 6 },
  { key: "rolling_rating_level_7", value: 7 },
  { key: "rolling_rating_level_8", value: 8 },
  { key: "rolling_rating_level_9", value: 9 },
];

const RollingSettingsForm = () => {
  const { data, isLoading, mutate } = getGradeSettings();
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm<RollingFormDataProps>();
  const userList = Form.useWatch('user_list',form);
  const rollingTarget = Form.useWatch('rolling_target', form);
  const paymentOnoff = Form.useWatch('rolling_payment_onoff', form);
  const betCountOnoff = Form.useWatch('rolling_condition_bets_per_day_onoff', form);
  const betAmountOnoff = Form.useWatch('rolling_condition_bets_amount_per_day_onoff', form);
  const [csvData, setCSVData] = useState<SettingsData['user_list']>([])

  // Deduction is enabled but nothing narrows it down → it hits every targeted
  // member on every payout, which is a flat site-wide cut, not a 공배팅 control.
  const noConditionSelected = !!paymentOnoff && !betCountOnoff && !betAmountOnoff;

  const handleSubmit = async (e: RollingFormDataProps) => {
   

    const newRollingGrades = grades.reduce<Record<keyof SettingsData, number>>((acc, {key, value}) => {
      acc[key] = (e.rollingGrades && e.rollingGrades.includes(value)) ? 1 : 0;
      return acc;
    }, {} as Record<keyof SettingsData, number>);

    const newRollingLevels = levels.reduce<Record<keyof SettingsData, number>>((acc, {key, value}) => {
      acc[key] = (e.rollingLevels && e.rollingLevels.includes(value)) ? 1 : 0;
      return acc;
    }, {} as Record<keyof SettingsData, number>);

    // Keep the saved list when no new CSV was uploaded — re-saving the form
    // (e.g. after new members register) must not wipe the existing 유저리스트.
    // Read it off the form store rather than `e.user_list`: the Form.List is
    // only mounted while 적용대상 = 유저리스트, so `e` carries no user_list under
    // 전체 and the list would otherwise be nulled on every save.
    const storedUserList = form.getFieldValue("user_list");
    const existingUserList = Array.isArray(storedUserList) ? storedUserList : [];
    const nextUserList = csvData && csvData.length > 0
      ? csvData
      : existingUserList.length > 0 ? existingUserList : null;

    const reqBody: RollingFormDataProps = {
      ...e,
      ...newRollingGrades,
      ...newRollingLevels,
      rolling_condition_bets_amount_per_day_onoff: e.rolling_condition_bets_amount_per_day_onoff ? 1 : 0,
      rolling_condition_bets_per_day_onoff: e.rolling_condition_bets_per_day_onoff ? 1 : 0,
      rolling_payment_onoff: e.rolling_payment_onoff ? 1 : 0,
      user_list: e.rolling_target === 1 || e.rolling_target === 4 ? nextUserList : null,
      rollingGrades: undefined,
      rollingLevels: undefined,
    }

    console.log(reqBody);

    try {
      const { data } = await updateRollingSettings(reqBody);
      
      notification[data.code === 0 ? "success" : "error"]({ message: data.message });
      
      if (data.code === 0) { 
        mutate();
        setDisabled(true)
      }
    } catch (error) {
      console.error("Error updating usdt settings:", error);
    }
  };

  useEffect(() => {
    if (csvData && csvData?.length > 0) {
      console.log(csvData)
      form.setFieldValue("user_list", csvData)
    }
  }, [csvData])

  useEffect(() => {
    if (data && !isLoading) {

      const rollingGrades = grades.reduce<number[]>((acc, { key, value }) => {
        if ((data[key]) === 1) acc.push(value);
        return acc;
      }, []);

      const rollingLevels = levels.reduce<number[]>((acc, { key, value }) => {
        if ((data[key]) === 1) acc.push(value);
        return acc;
      }, []);

      const users = data.user_list 
      && Array.isArray(data.user_list) 
      && data.user_list.length > 0 
      ? data.user_list.flatMap(item =>
        typeof item === "object" && "username" in item 
          ? [item.username] 
          : []
      )
    : [];

      console.log(users)

      form.setFieldsValue({
        ...data,
        user_list: users,
        rollingGrades,
        rollingLevels,
        rolling_payment_onoff: data.rolling_payment_onoff == 0 ? false : true,
        rolling_condition_bets_per_day_onoff: data.rolling_condition_bets_per_day_onoff == 0 ? false : true,
        rolling_condition_bets_amount_per_day_onoff: data.rolling_condition_bets_amount_per_day_onoff == 0 ? false : true,
      });
    }
  }, [data]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit} disabled={disabled}>
      {/* <Form.Item label={t("col.accountName")} name={"type"} required>
        <Select size="small">
          <Select.Option value="v-account1">가상계좌1</Select.Option>
          <Select.Option value="v-account2">가상계좌2</Select.Option>
        </Select>
      </Form.Item> */}
      <Typography.Title  level={5}>{i18next.t("sidemenu.rollingDeductionSettings")}</Typography.Title>
      <Row gutter={[40, 16]} align={'stretch'}>

        <Col span={6}>
          <Form.Item 
            label={'ID'}
            name={'id'}
            hidden
          >
            <InputNumber controls={false} size="small" style={{width: '100%'}} type="hidden"/>
          </Form.Item>
          <Form.Item
            label={i18next.t("system.rollingDeductionEnable")}
            name={"rolling_payment_onoff"}
            rules={[{ required: true }]}
          >
            <Switch />
          </Form.Item>
          <Typography.Text strong mark>{i18next.t("system.payoutPctSetting")}</Typography.Text>
          <Form.Item 
            label={i18next.t("gameCat.liveCasino")} 
            name={"rolling_payment_live"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("memberDetail.mis132")} 
            name={"rolling_payment_slot"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("memberDetail.mis133")} 
            name={"rolling_payment_sports"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("memberDetail.mis134")} 
            name={"rolling_payment_minigame"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("title.fishingGame")} 
            name={"rolling_payment_fishing"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("gameCat.board")} 
            name={"rolling_payment_board"} 
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
          <Form.Item 
            label={i18next.t("title.etc")} 
            name={"rolling_payment_etc"}
            rules={[{ required: true }]}
          >
            <InputNumber 
              formatter={(value) => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\%\s?|(,*)/g, '') as unknown as number}
              style={{width: '100%'}}
            />
          </Form.Item>
        </Col>

        <Col span={18} style={{borderLeft: '1px solid var(--ant-color-border-secondary)'}}>
          <div className="" style={{height: 81}}></div>
          <Space direction="vertical" split style={{width: '100%'}}>  
            <Card 
              size="small"
              title={
                <div style={{padding: '1rem 0 1rem 0'}}>
                  <Typography.Text strong mark>{i18next.t("system.applyTarget")}</Typography.Text>
                  <Form.Item name={"rolling_target"} initialValue={1} required style={{marginBottom: 0}}>
                    <Radio.Group>
                      <Radio value={1}>{i18next.t("col.all")}</Radio>
                      <Radio value={2}>{i18next.t("col.grade")}</Radio>
                      <Radio value={3}>{i18next.t("col.level")}</Radio>
                      <Radio value={4}>{i18next.t("title.userListTitle")}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              }
              style={{boxShadow: 'unset', width: '100%'}}
            >
              {(rollingTarget !== 1) && (
                <Alert
                  type="info"
                  showIcon
                  message={i18next.t("system.rollingTargetSnapshotNote")}
                  style={{marginBottom: '1rem'}}
                />
              )}
              {(rollingTarget === 2) && (
                <GradeCheckbox label={i18next.t("col.grade")} name="rollingGrades" hideAll />
              )}
              {(rollingTarget === 3) && (
                <UserLevelCheckBox label={i18next.t("col.level")} name="rollingLevels" hideAll />
              )}
              {(rollingTarget === 4) && (
                <>
                <CSVFileParser data={csvData} setData={setCSVData} disabled={disabled} />
                <Form.List name={"user_list"}>
                  {(fields) => (
                    <Flex gap="4px 0" wrap={'wrap'} style={{maxHeight: 150, overflowY: 'auto'}}>
                      {userList && userList.length > 0 && fields.map(({key, name}) => (
                        <Tag key={key}>{String(userList[name])}</Tag>
                      ))}
                    </Flex>
                  )}
                </Form.List>
                </>
              )}
            </Card>
            <Card
              style={{boxShadow: 'unset', width: '100%'}}
            > 
              <div className="">
                <Typography.Text strong mark>{i18next.t("system.applyCondition")}</Typography.Text>
              </div>
              {noConditionSelected && (
                <Alert
                  type="warning"
                  showIcon
                  message={i18next.t("system.rollingNoConditionWarning")}
                  style={{margin: '1rem 0'}}
                />
              )}
              <Row gutter={[16, 16]}>
                <Col>
                  <Flex gap={4}>
                    <Form.Item 
                      label={i18next.t("system.todayBetCount")} 
                      name={"rolling_condition_bets_per_day"} 
                      initialValue={100}  
                      rules={[{ required: true }]}
                    >
                      <InputNumber 
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        style={{width: '100%'}}
                        addonAfter={i18next.t("system.timesOrMore")}
                      />
                    </Form.Item>
                    <Form.Item 
                      label=" "
                      name={"rolling_condition_bets_per_day_onoff"} 
                    >
                      <Switch />
                    </Form.Item>
                  </Flex>
                </Col>
                <Col>
                  <Flex gap={4}>
                    <Form.Item 
                      label={i18next.t("system.todayBetAmount")} 
                      name={"rolling_condition_bets_amount_per_day"} 
                      initialValue={5000000}  
                      rules={[{ required: true }]}
                    >
                      <InputNumber 
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        style={{width: '100%'}}
                        addonAfter={i18next.t("system.orMore")}
                      />
                    </Form.Item>
                    <Form.Item 
                      label=" "
                      name={"rolling_condition_bets_amount_per_day_onoff"}  
                    >
                      <Switch />
                    </Form.Item>
                  </Flex>
                </Col>
                
              </Row>
            </Card>            
          </Space>
          
        </Col>
      </Row>
      
      <Divider />

      <Space direction="horizontal">
          <Button
          type="primary"
            htmlType="button"
            icon={disabled ? <EditOutlined /> : <StopOutlined />}
            onClick={() => setDisabled(!disabled)}
            disabled={false}
            danger={!disabled}
          >
            {disabled ? i18next.t("sportsBet.edit") : i18next.t("global.cancel")}
          </Button>
          <Button
            htmlType="submit"
            icon={<SaveOutlined />}
          >
            {i18next.t("global.save")}
          </Button>
        </Space >
    </Form>
  );
};

export default RollingSettingsForm;
