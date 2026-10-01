import { Col, Flex, Row, Typography } from "antd";
import { NewEvoBetData } from "@/api/bet-details/get";


const RouletteResults = ({ data }: { data?: NewEvoBetData['raw']['data'] }) => {

  const outcome = data?.result.outcomes[0];
  const luckyNumbers = Object.entries(data?.result.luckyNumbers || {});
  console.log({
    data,
    outcome,
    luckyNumbers
  })
  return (
    <Row justify={"space-evenly"} align={"middle"}>
      {outcome?.number && (
        <Col>
          <Typography.Title style={{
            color: `var(--ant-${outcome?.color?.toLowerCase()})`,
            fontSize: 60,
            fontWeight: 900,
            textAlign: 'center',
            margin: 0
          }}>
            <span style={{fontSize: 30, fontWeight: 700}}>
              당첨번호 <br />
            </span>
            {outcome?.number}
          </Typography.Title>
        </Col>
      )}
      {luckyNumbers.length > 0 && (
        <Col>
          <Flex gap={'1rem'}>
            <Typography.Title style={{
              color: `var(--ant-${outcome?.color?.toLowerCase()})`,
              // fontSize: 60,
              // fontWeight: 900,
              margin: 0
            }}>
              Lucky Numbers:
            </Typography.Title>
            {luckyNumbers.map(([key, value], index) => (
              <Typography.Title style={{
                color: `var(--ant-${outcome?.color?.toLowerCase()})`,
                // fontSize: 60,
                // fontWeight: 900,
                margin: 0
              }}>
                {key} - {value}{!(index === luckyNumbers.length - 1) && (", ")}
              </Typography.Title>
            ))}

          </Flex>
        </Col>
      )}
    </Row>
  );
  
};

export default RouletteResults;
