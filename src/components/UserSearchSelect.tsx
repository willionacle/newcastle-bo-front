import { userAPIStateQuery } from "@/api/users/get";
import { Select, SelectProps, Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stringify } from "qs";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  size?: SelectProps["size"];
}

const PAGE_LIMIT = 20;

// 회원 상세 상단 회원 검색: 아이디 또는 예금주로 검색해 바로 해당 회원 상세로 이동한다
const UserSearchSelect = ({ size }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    swr: { data, isLoading },
    setFilters,
  } = userAPIStateQuery({
    page: 1,
    limit: PAGE_LIMIT,
    orderby: "DESC",
    columnby: "createdAt",
    status: null,
    // userOrAccountName: 아이디 OR 예금주명 매칭
    userOrAccountName: null,
    username: null,
    referralUsername: null,
    agentUsername: null,
    userRealName: null,
    userLevel: null,
    startDate: null,
    endDate: null,
  });

  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [searchValue, setSearchValue] = useState("");
  const debounced = useDebounce(searchValue, 300);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentPage = (p: any) => Number(p?.currentPage ?? p?.page ?? 1);

  // Whether there is a next page to lazy-load
  const hasMore = useMemo(() => {
    const p = data?.data?.pagination;
    if (!p) return false;
    if (p.totalPages != null) return currentPage(p) < Number(p.totalPages);
    if (p.totalItems != null) return currentPage(p) * PAGE_LIMIT < Number(p.totalItems);
    return false;
  }, [data]);

  // Map items -> options; replace on page 1, append (deduped) on later pages
  useEffect(() => {
    if (!data?.data?.items) return;
    const { items, pagination } = data.data;
    const mapped = items.map((i: any) => ({
      value: i.id,
      label: i.username,
    }));
    setOptions((prev) => {
      if (currentPage(pagination) === 1) return mapped;
      const map = new Map((prev ?? []).map((o) => [o!.value, o]));
      mapped.forEach((o: any) => map.set(o.value, o));
      return Array.from(map.values());
    });
  }, [data]);

  // Debounced search -> reset to page 1 with new term
  useEffect(() => {
    setOptions([]);
    setFilters((prev) => ({ ...prev, userOrAccountName: debounced || null, page: 1 }));
    if (dropdownRef.current) dropdownRef.current.scrollTop = 0;
  }, [debounced]);

  // Infinite lazy-load: fetch next page when scrolled to bottom
  const handlePopupScroll: SelectProps["onPopupScroll"] = (e) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && !isLoading && hasMore) {
      setFilters((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }));
    }
  };

  const showListBtn = (options?.length ?? 0) > 1;
  const dropdownRender = (menu: React.ReactNode) => (
    <div>
      <div ref={dropdownRef} style={{ maxHeight: 300, overflowY: "auto" }}>
        {menu}
      </div>
      {showListBtn && (
        <div
          style={{ borderTop: "1px solid #f0f0f0", padding: 4 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Button
            type="link"
            size="small"
            block
            // 회원 목록 필터는 username 쿼리를 읽는다
            onClick={() => navigate(`/user?${stringify({ username: searchValue })}`)}
          >
            {t("userSearch.viewInList")}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Select
      showSearch
      value={null}
      placeholder={t("userSearch.placeholder")}
      style={{ width: "100%" }}
      size={size}
      options={options}
      loading={isLoading}
      filterOption={false}
      searchValue={searchValue}
      onSearch={setSearchValue}
      onSelect={(value) => navigate(`/user/${value}`)}
      onPopupScroll={handlePopupScroll}
      notFoundContent={t("userSearch.notFound")}
      allowClear
      dropdownRender={dropdownRender}
    />
  );
};

export default UserSearchSelect;
