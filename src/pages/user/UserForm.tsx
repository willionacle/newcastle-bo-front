import { api } from "@/api/axios";
import { depositAccountAPI, DepositAccountResponse } from "@/api/deposit-account/get";
import { BulkUpdateItem, updateDepositAccountsBulkAPI } from "@/api/deposit-account/put";
import { PostCreateUserBody } from "@/api/types";
import useUserStore from "@/store/user.store";
import { Form, notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UserFormLayout from "./UserFormLayout";
import { DepositMethodOption, UserFormProps, UserFormValues } from "./UserForm.types";
import { mergeUserMemos } from "@/utils/userMemo";
import { ordinaryUserUpdate } from "@/utils/ordinaryUserUpdate";
import {
  isMaskedValue,
  WithdrawalAccountUpdate,
  withdrawalAccountUpdate,
  withdrawalFields,
} from "@/utils/withdrawalAccountUpdate";
import { updateWithdrawalAccountAPI } from "@/api/users/sensitive";
import { classifySensitiveError } from "@/utils/sensitiveError";
import SensitivePasswordModal from "@/components/SensitivePasswordModal";

const UserForm = ({ user, mutate }: UserFormProps) => {
  const { token, userid } = useUserStore.getState();
  const { t } = useTranslation();
  const [form] = Form.useForm<UserFormValues>();
  const [level, setLevel] = useState(false);
  const [grade, setGrade] = useState(false);
  const [rolling, setRolling] = useState(true);
  const [lossing, setLossing] = useState(true);
  const navigate = useNavigate();
  const [depositAccountData, setDepositAccountData] = useState<DepositAccountResponse | null>(null);

  const depositMethodArray = useMemo<DepositMethodOption[]>(() => {
    return (
      depositAccountData?.data?.map((item) => ({
        value: item.type,
        label: item.title,
        title: item.title,
        isInput: item.isInput,
      })) ?? []
    );
  }, [depositAccountData]);

  // Ordinary members: password, phone and the withdrawal account are not part
  // of the general save (PUT /api/users keeps fields it is not sent —
  // NEWCASTLE_HANDOFF §2.4). They change through their own access-password
  // protected endpoints. Agents keep the old /updateagent behaviour.
  const isMember = !!user && user.role_name !== "agent";

  // Track user input only: setFieldsValue also marks fields touched in antd.
  const [withdrawalChanges, setWithdrawalChanges] = useState<Set<string>>(new Set());
  const [pendingWithdrawalUpdate, setPendingWithdrawalUpdate] = useState<WithdrawalAccountUpdate | null>(null);
  const trackWithdrawalChanges = (changed: object) => {
    const keys = Object.keys(changed).filter((key) => (withdrawalFields as string[]).includes(key));
    if (keys.length) setWithdrawalChanges((previous) => new Set([...previous, ...keys]));
  };

  const requestWithdrawalSave = async () => {
    let values: Partial<UserFormValues>;
    try {
      values = await form.validateFields(withdrawalFields);
    } catch {
      notification.error({ message: t("sensitive.withdrawalInvalid") });
      return;
    }
    const payload = withdrawalAccountUpdate(values, (key) => withdrawalChanges.has(key));
    if (!Object.keys(payload).length) {
      notification.info({ message: t("sensitive.withdrawalNoChanges") });
      return;
    }
    const masked = (["bankName", "accountNumber", "accountName", "walletAddress"] as const).some((key) =>
      isMaskedValue(payload[key])
    );
    if (masked) {
      notification.warning({ message: t("sensitive.withdrawalMasked") });
      return;
    }
    setPendingWithdrawalUpdate(payload);
  };

  /** Resolves with an inline error message, or nothing on success. */
  const saveWithdrawalAccount = async (accessPassword: string): Promise<string | void> => {
    if (!user || !pendingWithdrawalUpdate) return;
    try {
      const res = await updateWithdrawalAccountAPI(user.id, pendingWithdrawalUpdate, accessPassword);
      if (res.code !== 0) return res.message || t("sensitive.withdrawalFailed");
      setWithdrawalChanges(new Set());
      setPendingWithdrawalUpdate(null);
      notification.success({
        message: res.data?.changed?.length === 0
          ? t("sensitive.withdrawalNoChanges")
          : t("sensitive.withdrawalSaved"),
      });
      mutate?.();
    } catch (error) {
      const { kind, message } = classifySensitiveError(error);
      if (kind === "auth") return message || t("sensitive.wrongPassword");
      if (kind === "rateLimited") return message || t("sensitive.tooManyAttempts");
      return message || t("sensitive.withdrawalFailed");
    }
  };

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
      tree_depth: formValues.tree_depth,
      initial_bet_total: Number(formValues.initial_bet_total),
      deposit_total: Number(formValues.deposit_total),
      withdrawal_total: Number(formValues.withdrawal_total),
      userid: userid,
      rolling_point: 0,
      wallet_address: formValues.wallet_address ? formValues.wallet_address : null,
      network: formValues.network ? formValues.network : null,
      local_grade_config: formValues.local_grade_config ?? undefined,
      user_grade: Number(formValues.user_grade),
    };

    try {
      if (user) {
        const isAgent = user.role_name === "agent";
        const body = {
            ...user,
            // Agent records only define user_memo_1, so they must not be merged.
            ...(isAgent ? {} : mergeUserMemos(user)),
            userid: userid,
            account_name: formValues.account_name,
            account_number: formValues.account_number,
            agent_id: formValues.agent_id ? formValues.agent_id["label"] : null,
            bank_name: formValues.bank_name,
            lossing_point_percentage: formValues.lossing_point_percentage / 100,
            lossing_point_type: formValues.lossing_point_type,
            rolling_casino_percentage: formValues.rolling_casino_percentage / 100,
            rolling_slot_percentage: formValues.rolling_slot_percentage / 100,
            rolling_mini_game_percentage: formValues.rolling_mini_game_percentage / 100,
            rolling_sports_percentage: formValues.rolling_sports_percentage / 100,
            rolling_point_type: formValues.rolling_point_type,
            user_level: formValues.user_level,
            username: formValues.username,
            user_status: formValues.user_status,
            user_real_name: formValues.user_real_name,
            level_type: formValues.level_type,
            initial_bet_total: Number(formValues.initial_bet_total),
            deposit_total: Number(formValues.deposit_total),
            withdrawal_total: Number(formValues.withdrawal_total),
            parentID: formValues.agent_id ? formValues.agent_id["value"] : null,
            // Only when the operator typed one; absent = unchanged on the
            // server. Never echo anything from the row back.
            password: formValues.newPassword?.trim() || undefined,
            phone_number: formValues.phone_number,
            wallet_address: formValues.wallet_address ? formValues.wallet_address : null,
            network: formValues.network ? formValues.network : null,
            local_grade_config: formValues.local_grade_config,
            user_grade: Number(formValues.user_grade),
            referral_username: (formValues.referral_username as any)?.value ??
              formValues.referral_username ??
              user.referral_username,
            tree_depth: user.treeDepth ?? null,
            dw_sum: user.dwSum ?? 0,
            isAllowedAccountWithdrawal: formValues.isAllowedAccountWithdrawal,
            isAllowedOncashWithdrawal: formValues.isAllowedOncashWithdrawal,
          };
        const response = isAgent
          ? await api.updateAgent(body, token)
          : await api.updateUser(ordinaryUserUpdate(body), token);

        const {
          data: { code, message },
        } = response;

        if (code === 0) {
          notification.success({ message: "Edit Success!" });
          const unsavedWithdrawal = isMember &&
            [...withdrawalChanges].some((key) => key !== "isAllowedAccountWithdrawal" && key !== "isAllowedOncashWithdrawal");
          if (unsavedWithdrawal) {
            // The general save never carries the account; keep the operator here.
            notification.warning({ message: t("sensitive.withdrawalUnsaved") });
          } else {
            navigate(-1);
          }
        } else {
          notification.error({ message: message });
        }

        if (response) {
          const event = formValues as { [key: string]: any };

          const updates: BulkUpdateItem[] = depositMethodArray
            .map((item) => {
              const dbDepositAccount = depositAccountData?.data?.find(
                (account) => account.type === item.value
              );

              if (!dbDepositAccount) {
                return undefined;
              }

              const updateData: BulkUpdateItem["data"] = {
                type: dbDepositAccount.type,
                inUse: formValues.depositMethod.includes(dbDepositAccount.type) ? 1 : 0,
                title: item.title,
              };

              if (item.isInput === 1) {
                updateData.bankName = event[`${item.value}-bank_name`]?.trim() || null;
                updateData.accountNumber = event[`${item.value}-account_number`]?.trim() || null;
                updateData.accountName = event[`${item.value}-account_name`]?.trim() || null;
              }

              return {
                id: dbDepositAccount.id,
                data: updateData,
              };
            })
            .filter(Boolean) as BulkUpdateItem[];

          if (updates.length > 0 && formValues.username) {
            await updateDepositAccountsBulkAPI(formValues.username, { updates });
          }
        }
      } else {
        const response = await api.createUser(bodyData, token);
        const {
          data: { code, message },
        } = response;

        if (code === 0) {
          notification.success({ message: message });
          navigate(-1);
        } else {
          notification.error({ message: message });
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.error?.details
        ? `${error.response.data.error.details.error.details.errors[0].path[0]} ${error.response.data.error.details.error.details.errors[0].message}`
        : error.response?.data?.error?.message;

      notification.error({
        message: msg ?? "Fail",
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
    const fetchDepositAccounts = async () => {
      if (user?.username) {
        const data = await depositAccountAPI(user.username);
        setDepositAccountData(data);
      }
    };

    fetchDepositAccounts();
  }, [user?.username]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        account_name: user.account_name,
        phone_number: user.phone_number,
        rolling_casino_percentage: user.rolling_casino_percentage * 100,
        rolling_slot_percentage: user.rolling_slot_percentage * 100,
        rolling_mini_game_percentage: user.rolling_mini_game_percentage * 100,
        rolling_sports_percentage: user.rolling_sports_percentage * 100,
        lossing_point_percentage: user.lossing_point_percentage * 100,
        lossing_point_type: user.lossing_point_type,
        rolling_point_type: user.rolling_point_type,
        user_status: user.user_status,
        account_number: user.account_number,
        bank_name: user.bank_name,
        user_level: user.user_level ?? undefined,
        user_real_name: user.user_real_name ?? "",
        level_type: user.level_type,
        initial_bet_total: user.initial_bet_total,
        deposit_total: user.deposit_total,
        withdrawal_total: user.withdrawal_total,
        wallet_address: user.wallet_address,
        network: user.network,
        local_grade_config: user.local_grade_config ?? "automatic",
        user_grade: Number(user.user_grade),
        referral_username: user.referral_username,
        isAllowedAccountWithdrawal: user.isAllowedAccountWithdrawal === 1,
        isAllowedOncashWithdrawal: user.isAllowedOncashWithdrawal === 1,
      });
      setLevel(user.level_type === "MANUAL");
      setGrade((user.local_grade_config ?? "automatic") === "manual");
      setRolling(user.rolling_point_type !== "INDIVIDUAL");
      setLossing(user.lossing_point_type !== "INDIVIDUAL");
    }
  }, [form, user]);

  useEffect(() => {
    if (depositAccountData) {
      const depositMethod = depositAccountData.data
        .filter((item) => item.inUse)
        .map((item) => item.type);

      form.setFieldValue("depositMethod", depositMethod);

      depositAccountData.data.forEach((item) => {
        form.setFieldValue(`${item.type}-bank_name`, item.bankName);
        form.setFieldValue(`${item.type}-account_number`, item.accountNumber);
        form.setFieldValue(`${item.type}-account_name`, item.accountName);
      });
    }
  }, [depositAccountData, form]);

  return (
    <>
    {pendingWithdrawalUpdate && (
      <SensitivePasswordModal
        onConfirm={saveWithdrawalAccount}
        onCancel={() => setPendingWithdrawalUpdate(null)}
      />
    )}
    <UserFormLayout
      form={form}
      user={user}
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
      isMember={isMember}
      onWithdrawalSave={requestWithdrawalSave}
      onValuesChange={trackWithdrawalChanges}
    />
    </>
  );
};

export default UserForm;
