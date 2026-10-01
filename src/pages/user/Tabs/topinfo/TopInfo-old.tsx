import {
  widthdrawalDetailTopInfoAPI,
} from "@/api/withdrawal-detail/post";
import CommaNumber from "@/components/CommaNumber";
import DateRange from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Button, Col, Flex, Form, Input, notification, Row, Spin } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  username: string | undefined;
  lastDepositDate?: any
  endDate?: any
}

interface QueryData {
  dateRangeT: string[] | undefined;
  game_id: string | undefined;
}

const TopInfo = ({ username,}: Props) => {
  const [form] = Form.useForm();
  const { search, pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const {swr, setFilters} = widthdrawalDetailTopInfoAPI(username);

  const handleSubmit = (e: any) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        tab: pathname.includes('/user') ? "info" : undefined,
        game_id: e.game_id ? e.game_id : null,
        dateRangeT: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  const handleKoscaSearch = () => {
    const dateRange = form.getFieldValue('dateRange')
    if (dateRange && dateRange[0] && dateRange[1]) {

      const sdate = GF.formatDate(dateRange[0].tz().format(), true)
      const edate = GF.formatDate(dateRange[1].tz().format(), true)

      form.submit();
      window.open(`https://transbo.koscasol.com?userid=${username}&sdate=${sdate}&edate=${edate}&hideUserID=true`)
    } else {
      notification.warning({message: 'Date is required!'})
    }
  }

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as any
    console.log(e.game_id)
    form.setFieldsValue({
      game_id: e.game_id ? e.game_id : null,
      dateRange: e.dateRangeT ? [dayjs(e.dateRangeT[0]), dayjs(e.dateRangeT[1])]
      : [null, null],
    })
    setFilters((prevData) => ({
      ...prevData,
      username: username,
      start_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[0], true) : null,
      end_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[1], true) : null,
      game_id: e.game_id ? e.game_id : null,
    }))
  }, [search])

  return (
    <>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <DateRange showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} />
          </Col>

          <Col {...filterColProps}>
            <Form.Item label={t("memberDetail.mis053")} name={"game_id"}>
              <Input size="small" allowClear />
            </Form.Item>
          </Col>

          <Col
            {...filterColProps}
            style={{
              alignSelf: "center",
            }}
          >
            <SearchBtn size="small" />
            <Button
              size="small"
              htmlType="button"
              style={{
                marginLeft: "0.2rem",
              }}
              onClick={handleKoscaSearch}
            >
              배팅내역
            </Button>
          </Col>
        </Row>
      </Form>

      {swr.data?.data ? (
        <Flex gap={16} wrap="wrap">
          <Flex style={{ width: "16%" }} vertical>
            <p>카지노 배팅</p>
            <p>{swr.data?.data.C.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>슬롯 배팅</p>
            <p>{swr.data?.data.S.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>스포츠 배팅</p>
            <p>{swr.data?.data.SP.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>미니게임 배팅</p>
            <p>{swr.data?.data.M.sum.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>총 배팅</p>
            <p>
              {(
                swr.data?.data.C.sum +
                swr.data?.data.S.sum +
                swr.data?.data.SP.sum +
                swr.data?.data.M.sum
              ).toLocaleString()}
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>카지노 당첨</p>
            <div>
              <CommaNumber value={swr.data?.data.C.win} onlyNumber />
            </div>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>슬롯 당첨</p>
            <div>
              <CommaNumber value={swr.data?.data.S.win} onlyNumber />
            </div>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>스포츠 당첨</p>
            <div>
              <CommaNumber value={swr.data?.data.SP.win} onlyNumber />
            </div>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>미니게임 당첨</p>
            <div>
              <CommaNumber value={swr.data?.data.M.win} onlyNumber />
            </div>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>총 당첨</p>
            <CommaNumber
              value={
                swr.data?.data.C.win +
                swr.data?.data.S.win +
                swr.data?.data.SP.win +
                swr.data?.data.M.win
              }
              onlyNumber
            />
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>카지노 배팅 횟수</p>
            <p>{swr.data?.data.C.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>슬롯 배팅 횟수</p>
            <p>{swr.data?.data.S.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>스포츠 배팅 횟수</p>
            <p>{swr.data?.data.SP.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>미니게임 배팅 횟수</p>
            <p>{swr.data?.data.M.count.toLocaleString()}</p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>총 게임 횟수</p>
            <p>
              {(
                swr.data?.data.C.count +
                swr.data?.data.S.count +
                swr.data?.data.SP.count +
                swr.data?.data.M.count
              ).toLocaleString()}
            </p>
          </Flex>
          <Flex style={{ width: "16%" }} vertical>
            <p>스포츠 대기중</p>
            <p>{(swr.data?.data.SP.waiting ?? 0).toLocaleString()}</p>
          </Flex>
        </Flex>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default TopInfo;
