import i18next from "@/i18n/i18n";
import { BetLogType } from "@/api/betting-logs/get";
import CommaNumber from "@/components/CommaNumber";

interface Props {
    data?: BetLogType['total']
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
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "20%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "6%"}} />
                                        <col style={{width: "10%"}} />
                                        <col style={{width: "20%"}} />
                                    </colgroup>
                                    <tbody className="ant-table-tbody">
                                        <tr className="ant-table-row ant-table-row-level-0 font-bold" style={{backgroundColor: '#f0f1f7'}}>
                                            <td className="ant-table-cell" colSpan={5} style={{textAlign: 'right', padding: 4}}>{i18next.t("col.total")}</td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{minWidth: 120}}>
                                                    <CommaNumber value={data?.bet_amount} onlyNumber />
                                                </div>
                                            </td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{minWidth: 120}}>
                                                    <CommaNumber value={data?.win_amount} onlyNumber />
                                                </div>
                                            </td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{minWidth: 120}}>
                                                    <CommaNumber value={data?.win_loss} onlyNumber />
                                                </div>
                                            </td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}></td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}></td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}></td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}></td>
                                            <td className="ant-table-cell" style={{textAlign: 'center', padding: 4}}>
                                                <div className="" style={{width: 100}}></div>
                                            </td>
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