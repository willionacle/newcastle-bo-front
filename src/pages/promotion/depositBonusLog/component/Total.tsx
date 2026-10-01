import i18next from "@/i18n/i18n";
import { DepositBonusListType } from "@/api/deposit-bonuses/get";
import CommaNumber from "@/components/CommaNumber";

interface Props {
    data?: DepositBonusListType['total'];
}

const Total = ({data}: Props) => {

    return (
        <>
        <div className="css-var-r1 ant-table-css-var ant-table-wrapper">
            <div className="ant-spin-nested-loading css-var-r1">
                <div className="ant-spin-container">
                    <div className="ant-table css-var-r1 ant-table-css-var ant-table-scroll-horizontal">
                        <div className="ant-table-container">
                            <div className="ant-table-body" style={{overflow: 'auto hidden'}}>
                                <table style={{
                                    width: '1000px', minWidth: '100%', tableLayout: 'auto',
                                }}>
                                    <colgroup>
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                        <col style={{width: "14.286%"}} />
                                    </colgroup>
                                    <tbody className="ant-table-tbody">
                                        <tr className="ant-table-row ant-table-row-level-0 font-bold" style={{backgroundColor: '#f0f1f7'}}>
                                            <td className="ant-table-cell" colSpan={4} style={{textAlign: 'right', padding: 4}}>{i18next.t("col.total")}</td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{minWidth: 120}}>
                                                    <CommaNumber value={data?.total_amount} onlyNumber />
                                                </div>
                                            </td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{minWidth: 120}}>
                                                    <CommaNumber value={data?.total_bonus_amount} onlyNumber />
                                                </div>
                                            </td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Total