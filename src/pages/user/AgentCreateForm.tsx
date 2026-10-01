import { api } from "@/api/axios";
import { PostCreateUserBody } from "@/api/types";
import useUserStore from "@/store/user.store";
import { Form, notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserFormLayout from "./UserFormLayout";
import { UserFormValues } from "./UserForm.types";

const AgentCreateForm = () => {
  const { token, userid } = useUserStore.getState();
  const { t } = useTranslation();
  const [form] = Form.useForm<UserFormValues>();
  const [level, setLevel] = useState(false);
  const [grade, setGrade] = useState(false);
  const [rolling, setRolling] = useState(true);
  const [lossing, setLossing] = useState(true);
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  const agent = {
    depth: searchParam.get("depth"),
    agent_username: searchParam.get("agent_username"),
    agent_id: searchParam.get("agent_id"),
  };

  const depositMethodArray = useMemo(() => [], []);

  const handleSubmit = async (formValues: UserFormValues) => {
    const bodyData: PostCreateUserBody = {
      account_name: formValues.account_name,
      account_number: formValues.account_number,
      agent_id: formValues.agent_id ? formValues.agent_id["label"] : null,
      parentID: formValues.agent_id ? formValues.agent_id["value"] : null,
      bank_name: formValues.bank_name,
      lossing_point_percentage: formValues.lossing_point_percentage / 100,
      lossing_point_type: formValues.lossing_point_type,
      password: formValues.password,
      phone_number: formValues.phone_number,
      rolling_casino_percentage: formValues.rolling_casino_percentage / 100,
      rolling_slot_percentage: formValues.rolling_slot_percentage / 100,
      rolling_mini_game_percentage: formValues.rolling_mini_game_percentage / 100,
      rolling_sports_percentage: formValues.rolling_sports_percentage / 100,
      rolling_point_type: formValues.rolling_point_type,
      level_type: formValues.level_type,
      user_level: formValues.user_level,
      username: formValues.username,
      user_status: formValues.user_status,
      user_real_name: formValues.user_real_name,
      tree_depth: agent?.depth ? Number(agent?.depth) : undefined,
      initial_bet_total: Number(formValues.initial_bet_total),
      deposit_total: Number(formValues.deposit_total),
      withdrawal_total: Number(formValues.withdrawal_total),
      userid,
      rolling_point: 0,
      wallet_address: formValues.wallet_address ? formValues.wallet_address : null,
      network: formValues.network ? formValues.network : null,
      local_grade_config: formValues.local_grade_config ?? undefined,
      user_grade: Number(formValues.user_grade),
    };

    const agentBody = {
      userid: bodyData.userid,
      username: bodyData.username,
      password: bodyData.password,
      account_name: bodyData.account_name,
      account_number: bodyData.account_number,
      bank_name: bodyData.bank_name,
      phone_number: bodyData.phone_number,
      rolling_point: bodyData.rolling_point,
      user_real_name: bodyData.user_real_name,
      user_level: bodyData.user_level,
      user_status: bodyData.user_status,
      level_type: bodyData.level_type,
      rolling_point_type: bodyData.rolling_point_type,
      lossing_point_type: bodyData.lossing_point_type,
      lossing_point_percentage: bodyData.lossing_point_percentage,
      rolling_slot_percentage: bodyData.rolling_slot_percentage,
      rolling_mini_game_percentage: bodyData.rolling_mini_game_percentage,
      rolling_sports_percentage: bodyData.rolling_sports_percentage,
      rolling_casino_percentage: bodyData.rolling_casino_percentage,
      deposit_total: bodyData.deposit_total,
      withdrawal_total: bodyData.withdrawal_total,
      parentID: formValues.agent_id ? formValues.agent_id["value"] : agent.agent_id,
      agent_id: formValues.agent_id ? formValues.agent_id["label"] : agent.agent_username,
      initial_bet_total: bodyData.initial_bet_total,
      tree_depth: bodyData.tree_depth,
      local_grade_config: formValues.local_grade_config,
      user_grade: Number(formValues.user_grade),
    };

    try {
      const res = await api.createAgent(agentBody, token);
      const {
        data: { code, message },
      } = res;

      if (code === 0) {
        notification.success({ message });
        navigate("/agent");
      } else {
        notification.error({ message });
      }
    } catch (error: any) {
      notification.error({
        message: "Failed",
        description: error.response?.data?.message,
      });
    }
  };

  const handleChangeLevelOption = (value: string) => {
    setLevel(value === "MANUAL");
  };

  const handleChangeGradeOption = (value: string) => {
    setGrade(value === "manual");
  };

  const handleChangeRollingOption = (value: string) => {
    setRolling(value !== "INDIVIDUAL");
  };

  const handleChangeLossingOption = (value: string) => {
    setLossing(value !== "INDIVIDUAL");
  };

  useEffect(() => {
    if (agent.agent_id && agent.agent_username) {
      form.setFieldsValue({
        agent_id: {
          label: agent.agent_username,
          value: agent.agent_id,
        },
      });
    }
  }, [agent.agent_id, agent.agent_username, form]);

  return (
    <UserFormLayout
      form={form}
      t={t}
      level={level}
      grade={grade}
      rolling={rolling}
      lossing={lossing}
      depositMethodArray={depositMethodArray}
      onLevelOptionChange={handleChangeLevelOption}
      onGradeOptionChange={handleChangeGradeOption}
      onRollingOptionChange={handleChangeRollingOption}
      onLossingOptionChange={handleChangeLossingOption}
      onSubmit={handleSubmit}
    />
  );
};

export default AgentCreateForm;
