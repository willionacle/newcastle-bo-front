import AgentSelect from "@/components/AgentSelect";
import i18next from "@/i18n/i18n";
import GradeSelect from "@/components/GradeSelect";
import Panel from "@/components/Panel";
import ReferralUserSelect from "@/components/ReferralUserSelect";
import SaveBtn from "@/components/SaveBtn";
import UserGameSettings from "@/components/UserGameSettings";
import UserStatusSelector from "@/components/UserStatusSelector";
import { Checkbox, Col, Divider, Form, Input, Row, Select, Space, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import Password from "antd/lib/input/Password";
import { TFunction } from "i18next";
import { ResUser } from "@/api/types";
import UserRollingForm from "./UserRollingForm";
import { DepositMethodOption, UserFormValues } from "./UserForm.types";
import { SetPasswordButton } from "./Tabs/infomation/components/MemberSessionActions";
import { isMaskedValue, isValidWalletAddress } from "@/utils/withdrawalAccountUpdate";

interface UserFormLayoutProps {
  form: FormInstance<UserFormValues>;
  user?: ResUser["data"];
  t: TFunction;
  level: boolean;
  grade: boolean;
  rolling: boolean;
  lossing: boolean;
  depositMethodArray: DepositMethodOption[];
  onLevelOptionChange: (value: string) => void;
  onGradeOptionChange: (value: string) => void;
  onRollingOptionChange: (value: string) => void;
  onLossingOptionChange: (value: string) => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
  /** Editing an ordinary member (not an agent, not a new record). */
  isMember?: boolean;
  /** Saves the 출금계좌 panel through PATCH /api/users/:id/withdrawal-account. */
  onWithdrawalSave?: () => void;
  onValuesChange?: (changed: Partial<UserFormValues>) => void;
}

const UserFormLayout = ({
  form,
  user,
  t,
  level,
  grade,
  rolling,
  lossing,
  depositMethodArray,
  onLevelOptionChange,
  onGradeOptionChange,
  onRollingOptionChange,
  onLossingOptionChange,
  onSubmit,
  isMember = false,
  onWithdrawalSave,
  onValuesChange,
}: UserFormLayoutProps) => {
  return (
    <Form className="user-form" form={form} layout="vertical" onFinish={onSubmit} onValuesChange={onValuesChange}>
      <Panel title={i18next.t("title.accountInfo")}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="username"
              label={t("memberInfoEdit.mie001")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {isMember && (
            // Members: 비밀번호 재설정 (PATCH /api/users/:username/password) —
            // the general save never carries a password.
            <Col span={8}>
              <Form.Item label={i18next.t("col.password")}>
                <SetPasswordButton username={user?.username} />
              </Form.Item>
            </Col>
          )}

          {user && !isMember && (
            <Col
              span={8}
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Form.Item label={i18next.t("col.password")} style={{ flex: "1" }} name="newPassword">
                <Password type="password" style={{ borderRadius: "var(--ant-border-radius)" }} />
              </Form.Item>
            </Col>
          )}

          {!user && (
            <Col span={8}>
              <Form.Item
                name="password"
                label={t("memberInfoEdit.mie028")}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          )}

          <Col span={8}>
            <Form.Item
              name="user_real_name"
              label={t("memberInfoEdit.mie002")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <UserStatusSelector />
          </Col>
          {/* Members: the phone is revealed / changed on the member detail
              page (access password required), never through this save. */}
          {!isMember && (
            <Col span={8}>
              <Form.Item
                name="phone_number"
                label={t("memberInfoEdit.mie003")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={8}>
            <AgentSelect label={t("memberInfoEdit.mie005")} initialValue={user?.agent_username} />
          </Col>

          <Col span={8}>
            <Form.Item name="deposit_total" label={i18next.t("col.totalDeposit")}>
               <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="withdrawal_total" label={i18next.t("col.totalWithdrawal")}>
               <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="initial_bet_total" label={i18next.t("topNavi.tn002")}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <ReferralUserSelect
              label={t("memberInfo.mi009")}
              initialValue={user?.referral_username}
            />
          </Col>
        </Row>
        <SaveBtn className="user-button" size="middle" />
      </Panel>

      <UserRollingForm user={user} />

      <Panel title={i18next.t("title.settings")}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="level_type" label={t("memberInfoEdit.mie006")} initialValue="AUTO">
              <Select onChange={onLevelOptionChange}>
                <Select.Option value="AUTO">{t("memberInfoEdit.mie007")}</Select.Option>
                <Select.Option value="MANUAL">{t("memberInfoEdit.mie008")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label=" " name="user_level">
              <Input disabled={!level} />
            </Form.Item>
          </Col>

          <Divider style={{ margin: "0 0 1rem" }} />
          <Col span={8}>
            <Form.Item
              name="local_grade_config"
              label={t("memberInfoEdit.mie036")}
              initialValue="automatic"
            >
              <Select onChange={onGradeOptionChange}>
                <Select.Option value="automatic">{t("memberInfoEdit.mie037")}</Select.Option>
                <Select.Option value="manual">{t("memberInfoEdit.mie038")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label=" " name="user_grade" initialValue={user?.user_grade ?? 1}>
              <GradeSelect hideAll disabled={!grade} />
            </Form.Item>
          </Col>

          <Divider style={{ margin: "0 0 1rem" }} />
          <Col span={8}>
            <Form.Item
              name="rolling_point_type"
              label={t("col.rollingSetting")}
              initialValue="OFF"
              rules={[{ required: true }]}
            >
              <Select onChange={onRollingOptionChange}>
                <Select.Option value="OFF">{t("memberInfoEdit.mie015")}</Select.Option>
                <Select.Option value="LEVEL">{t("memberInfoEdit.mie016")}</Select.Option>
                <Select.Option value="INDIVIDUAL">{t("memberInfoEdit.mie017")}</Select.Option>
                <Select.Option value="AGENT">{t("memberInfoEdit.mie035")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={16} />
          <Col span={8}>
            <Form.Item
              name="rolling_casino_percentage"
              label={t("memberInfoEdit.mie014-1")}
              rules={rolling ? [] : [{ required: true }]}
            >
              <Input disabled={rolling} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="rolling_slot_percentage"
              label={t("memberInfoEdit.mie014-2")}
              rules={rolling ? [] : [{ required: true }]}
            >
              <Input disabled={rolling} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="rolling_mini_game_percentage"
              label={t("memberInfoEdit.mie014-3")}
              rules={rolling ? [] : [{ required: true }]}
            >
              <Input disabled={rolling} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="rolling_sports_percentage"
              label={t("memberInfoEdit.mie014-4")}
              rules={rolling ? [] : [{ required: true }]}
            >
              <Input disabled={rolling} />
            </Form.Item>
          </Col>

          <Divider style={{ margin: "0 0 1rem" }} />
          <Col span={8}>
            <Form.Item
              name="lossing_point_type"
              label={t("col.paybackSetting")}
              initialValue="OFF"
              rules={[{ required: true }]}
            >
              <Select onChange={onLossingOptionChange}>
                <Select.Option value="OFF">{t("memberInfoEdit.mie015")}</Select.Option>
                <Select.Option value="LEVEL">{t("memberInfoEdit.mie016")}</Select.Option>
                <Select.Option value="INDIVIDUAL">{t("memberInfoEdit.mie017")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label=" "
              name="lossing_point_percentage"
              rules={lossing ? [] : [{ required: true }]}
            >
              <Input disabled={lossing} />
            </Form.Item>
          </Col>
        </Row>
        <SaveBtn className="user-button" size="middle" />
      </Panel>

      <Panel title={i18next.t("memberInfoEdit.mie023")}>
        {isMember && (
          <Typography.Paragraph type="secondary">
            {t("sensitive.withdrawalNote")}
          </Typography.Paragraph>
        )}
        <Row gutter={16}>
          {user && (
            <Col span={24}>
              <Form.Item label={i18next.t("col.withdrawalType")}>
                <Space>
                  <Form.Item name="isAllowedAccountWithdrawal" valuePropName="checked" initialValue={true} noStyle>
                    <Checkbox>{i18next.t("payment.bankWithdraw")}</Checkbox>
                  </Form.Item>
                  <Form.Item name="isAllowedOncashWithdrawal" valuePropName="checked" initialValue={true} noStyle>
                    <Checkbox>{i18next.t("user.oncashWithdraw")}</Checkbox>
                  </Form.Item>
                </Space>
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item
              label={t("memberInfoEdit.mie024")}
              name="bank_name"
              rules={[{ required: !user }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("memberInfoEdit.mie025")}
              name="account_number"
              rules={[{ required: !user }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("memberInfoEdit.mie026")}
              name="account_name"
              rules={[{ required: !user }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="network" label={t("col.network")} initialValue={null}>
              <Select allowClear>
                <Select.Option value="TRC-20">TRC-20</Select.Option>
                <Select.Option value="ERC-20">ERC-20</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("col.usdtAddress")}
              name="wallet_address"
              initialValue={null}
              dependencies={["network"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator: (_, value) =>
                    // A masked echo or the stored, untouched pair is left alone,
                    // so an unrelated save is never blocked by old data.
                    isMaskedValue(value) ||
                    (!!user && value === user.wallet_address && getFieldValue("network") === user.network) ||
                    isValidWalletAddress(getFieldValue("network"), value)
                      ? Promise.resolve()
                      : Promise.reject(new Error(t("sensitive.invalidWallet"))),
                }),
              ]}
            >
              <Input allowClear autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <SaveBtn
          className="user-button"
          size="middle"
          type={isMember ? "button" : "submit"}
          onClick={isMember ? onWithdrawalSave : undefined}
        />
      </Panel>

      {user && (
        <Panel title={t("memberInfoEdit.mie033")}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="depositMethod"
                rules={[{ required: true }]}
                initialValue={depositMethodArray[0]?.value}
              >
                <Checkbox.Group options={depositMethodArray} />
              </Form.Item>
            </Col>
          </Row>

          {depositMethodArray.map((item) => {
            if (item.isInput === 1) {
              return (
                <Row key={item.value} gutter={16}>
                  <Col span={24}>
                    <div
                      style={{
                        marginBottom: 4,
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {item.label}
                    </div>
                  </Col>
                  <Col span={8}>
                    <Form.Item label={t("col.bankNetwork")} name={`${item.value}-bank_name`}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label={t("col.accountWalletAddress")} name={`${item.value}-account_number`}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label={t("memberInfoEdit.mie002")} name={`${item.value}-account_name`}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              );
            }
            return null;
          })}
          <SaveBtn className="user-button" size="middle" />
        </Panel>
      )}

      {user && <UserGameSettings userId={user.id} username={user.username} />}
    </Form>
  );
};

export default UserFormLayout;
