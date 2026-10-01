import { useSearchUsernames } from "@/api/users/search-usernames";
import { useDebounce } from "@/hooks/useDebounce";
import { GF } from "@/utils/GlobalFunctions";
import { Button, Select, SelectProps, Space, Typography } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  size?: SizeType;
  maxCount?: number;
  placeholder?: string;
}

export const MAX_EXCLUDED_USERNAMES = 1000;
export const MAX_USERNAME_LENGTH = 255;

/**
 * 공백 제거 → 빈 값 제거 → 대소문자 무시 중복 제거 (서버 저장 규칙과 동일).
 * maxCount 를 넘는 항목은 잘라낸다.
 */
export const normalizeUsernames = (
  list: (string | null | undefined)[] | null | undefined,
  maxCount: number = MAX_EXCLUDED_USERNAMES
) => {
  const seen = new Set<string>();
  const result: string[] = [];

  (list ?? []).forEach((raw) => {
    const username = String(raw ?? "").trim();
    if (!username) return;

    const key = username.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    if (result.length < maxCount) result.push(username);
  });

  return result;
};

/** 서버가 배열 또는 JSON 문자열로 내려줘도 string[] 로 맞춘다. */
export const parseUsernameList = (value: unknown): string[] => {
  if (!value) return [];

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? normalizeUsernames(parsed) : [];
  } catch (error) {
    console.error("Invalid username list:", error);
    return [];
  }
};

/** 회원 아이디 다중 선택. 검색 결과에서 고르거나 직접 입력 후 Enter/콤마/공백으로 추가한다. */
const ExcludedUsernameSelect = ({
  value,
  onChange,
  disabled = false,
  size,
  maxCount = MAX_EXCLUDED_USERNAMES,
  placeholder,
}: Props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const debounced = useDebounce(searchValue, 300);

  const { data, isLoading } = useSearchUsernames({
    username: debounced.trim() || null,
  });

  const selected = value ?? [];

  // label 은 username 그대로 둔다. 검색 결과에서 사라져도 태그 표기가 흔들리지 않는다.
  const options: SelectProps["options"] = useMemo(
    () =>
      (data ?? []).map((item) => ({
        value: item.username,
        label: item.username,
        userLevel: item.userLevel,
        userGrade: item.userGrade,
      })),
    [data]
  );

  const handleChange = (next: string[]) => {
    // searchValue 를 제어하고 있으므로 선택 후 검색어는 직접 비운다.
    setSearchValue("");
    onChange?.(normalizeUsernames(next, maxCount));
  };

  return (
    <div>
      <Select
        value={selected}
        onChange={handleChange}
        mode="tags"
        showSearch
        allowClear
        disabled={disabled}
        size={size}
        style={{ width: "100%" }}
        placeholder={placeholder ?? t("excludedUsernames.placeholder")}
        loading={isLoading}
        filterOption={false}
        searchValue={searchValue}
        onSearch={setSearchValue}
        onBlur={() => setSearchValue("")}
        tokenSeparators={[",", " ", "\n", "\t"]}
        options={options}
        notFoundContent={
          isLoading
            ? t("excludedUsernames.loading")
            : searchValue
            ? t("excludedUsernames.noResult")
            : t("excludedUsernames.typeToSearch")
        }
        optionRender={(opt) => {
          const { userLevel, userGrade } = (opt.data ?? {}) as {
            userLevel?: number;
            userGrade?: number;
          };
          return (
            <Space size={6}>
              <span>{opt.label}</span>
              {userLevel != null && (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Lv.{userLevel} / {GF.handleGradeStrVal(userGrade ?? null)}
                </Typography.Text>
              )}
            </Space>
          );
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {selected.length > 0
            ? t("excludedUsernames.count", { n: selected.length, max: maxCount })
            : t("excludedUsernames.empty")}
        </Typography.Text>
        {selected.length > 0 && !disabled && (
          <Button type="link" size="small" onClick={() => onChange?.([])}>
            {t("excludedUsernames.clearAll")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExcludedUsernameSelect;
