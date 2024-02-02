import { Budget, Flow, FlowStatus, FlowInOrOut, PageRequest, PageResponse, PayType, BudgetWithMoney } from "@/types/models";

import dayjs from "dayjs";
import useSWR from "swr";

import { POSTFetcher } from "./global/api";

export function parseCSV2FlowOption(datas: { [key: string]: any }[], type: PayType, user_idf: string, budgets: Budget[]): CreateOrUpdateFlowOptions[] {
    const flows: CreateOrUpdateFlowOptions[] = [];
    if (type === PayType.WECHAT) {
        // 交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号,商户单号,备注
        /*
        { "交易时间": "2022/8/12 12:01", "交易类型": "扫二维码付款", 
        "交易对方": "毛先森", "商品": "收款方备注:二维码收款", "收/支": "支出", 
        "金额(元)": "￥14.00", "支付方式": "零钱", "当前状态": "已转账", 
        "交易单号": "\"100010730122081200058222425414685335\t\"", 
        "商户单号": "\"10001073012022081200588463773124\t\"", "备注": "/" }
        */
        for (const data of datas) {
            const flow: CreateOrUpdateFlowOptions = {
                title: "",
                user_idf: user_idf,
                money_fen: 0,

                in_or_out: FlowInOrOut.UNKONWN,
                flow_status: FlowStatus.UNCHECKED,
                pay_type: PayType.WECHAT,
                pay_detail: data["支付方式"],

                counterparty: data["交易对方"],
                order_id: data["交易单号"],

                product_info: data["商品"],

                source_raw: JSON.stringify(data),
                remark: data["备注"],
                spend_at: dayjs(data["交易时间"], "YYYY/M/D HH:mm").valueOf(),
            };
            let money: string = data["金额(元)"];
            // remove first char

            if (money.includes("￥") || money.includes("¥")) {
                money = money.substring(1);
            }
            flow.money_fen = parseFloat(money) * 100;

            flow.money_fen = Math.round(flow.money_fen);
            if (flow.remark === "/") {
                flow.remark = "";
            }
            flow.title = `${flow.counterparty}-${money}`

            if (data["收/支"] === "收入") {
                flow.in_or_out = FlowInOrOut.IN;
            } else if (data["收/支"] === "支出") {
                flow.in_or_out = FlowInOrOut.OUT;
            } else if (data["收/支"] === "/" || data["收/支"] === "") {
                flow.in_or_out = FlowInOrOut.IGNORE;
            } else {
                throw new Error(`不支持的收支类型：${JSON.stringify(data)}`);
            }
            // 如果有已经退款的账单就不要导入了
            if (data["当前状态"] === "已全额退款") {
                continue;
            }
            flows.push(flow);
        }
    } else if (type === PayType.ALIPAY) {
        // console.log(`datas: ${JSON.stringify(datas[0])}`);
        // 交易时间,交易分类,交易对方,对方账号,商品说明,收/支,金额,收/付款方式,交易状态,交易订单号,商家订单号,备注
        /*
         {"交易时间":"2023/9/22 20:44","交易分类":"美容美发","交易对方":"澳松**店",
         "对方账号":"m18***@163.com",
         "商品说明":"澳松适用罗曼/多希尔/千山/softie/南极人电动牙刷头通用替换D5T3 等多件",
         "收/支":"支出","金额":"23","收/付款方式":"招商银行信用卡(3802)",
         "交易状态":"等待确认收货","交易订单号":"\"2023092222001136411423862294\t\"",
         "商家订单号":"\"T200P1978089349363082368\t\"","备注":"/"}
        */
        for (const data of datas) {
            const flow: CreateOrUpdateFlowOptions = {
                title: data["商品说明"],
                user_idf: user_idf,
                money_fen: 0,

                in_or_out: FlowInOrOut.UNKONWN,
                flow_status: FlowStatus.UNCHECKED,
                pay_type: PayType.ALIPAY,
                pay_detail: data["收/付款方式"],

                counterparty: data["交易对方"],
                order_id: data["交易订单号"],

                product_info: data["商品说明"],
                source_raw: JSON.stringify(data),
                remark: data["备注"],
                spend_at: dayjs(data["交易时间"], "YYYY/M/D HH:mm").valueOf()
            };
            flow.budget_idf = budgets.find((item) => item.title === data["交易分类"])?.identifier;
            const money = data["金额"];
            flow.money_fen = parseFloat(money) * 100;
            flow.money_fen = Math.round(flow.money_fen);

            flow.title = `${flow.counterparty}-${money}`

            if (flow.remark === "/") {
                flow.remark = "";
            }

            if (flow.product_info?.includes("水费") || flow.product_info?.includes("电费") || flow.product_info?.includes("燃气费")) {
                const bid = budgets.find((item) => item.title === "水电气")?.identifier;
                if (bid) {
                    flow.budget_idf = bid;
                } else {
                    throw new Error(`找不到预算：住房水电`);
                }
            }

            if (data["收/支"] === "收入") {
                flow.in_or_out = FlowInOrOut.IN;
            } else if (data["收/支"] === "支出") {
                flow.in_or_out = FlowInOrOut.OUT;
            } else if (data["收/支"] === "不计收支" || data["收/支"] === "") {
                flow.in_or_out = FlowInOrOut.IGNORE;
            } else {
                throw new Error(`不支持的收支类型：${data["收/支"]}`);
            }

            // 如果是交易关闭的，就不要导入了
            if (data["交易状态"] === "交易关闭") {
                continue;
            } else if (data["交易状态"] === "退款成功") {
                continue;
            } else {

            }
            console.log(`flow: ${JSON.stringify(flow)}`);
            flows.push(flow);
        }
    } else {
        throw new Error(`不支持的支付类型：${type}`);
    }
    return flows;
}

export function parseCSV(csvText: string, type: PayType): { [key: string]: any }[] {
    const lines = csvText.split('\n');
    const headers = lines[0].trim().split(',').map((item) => item.trim()).filter((item) => item !== '');

    console.log(`headers: ${headers}`);
    const datas: { [key: string]: any }[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((item) => item.trim()).filter((item) => item !== '');
        // console.log(`values: ${values.length} \n values: ${values} \n headers: ${headers.length}`)
        if (values.length === 0) {
            continue;
        }
        if (headers.length - values.length === 1) {
            values.push("");
        }

        if (values.length === headers.length) {
            const entry: { [key: string]: any } = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j].trim().replace(/^"|"$/g, '');
                if (entry[headers[j]] === "/") {
                    entry[headers[j]] = "";
                }
            }
            datas.push(entry);
        }
    }
    console.log(`datas: ${JSON.stringify(datas[1])}`);
    console.log(`got type: ${type}`);
    return datas;
}

export function getCSVContent(raw: string): string {
    const lines = raw.split('\n');
    let inContent = true;
    let csvContent = "";

    for (const line of lines) {
        console.log(`line: ${line}`)
        // 对比是否是微信支付账单明细
        if (line.startsWith("微信支付账单明细") || line.startsWith("支付宝交易明细列表") || line.startsWith("------------------")) {
            inContent = false;
        }
        if (inContent) {
            csvContent += line + '\n';
        }
        if (line.trim().includes("----------------------微信支付账单明细列表--------------------") || line.trim().includes("支付宝（中国）网络技术有限公司  电子客户回单")) {
            inContent = true;
        }
    }
    return csvContent;
}


export interface CreateOrUpdateBudgetOptions {
    identifier?: string;
    title: string;
    parent_idf?: string;
    remark?: string;
}
// create budget
const createBudget = async (budget: CreateOrUpdateBudgetOptions): Promise<Budget> => {
    return POSTFetcher("api/backend/finance/budget/add", { payload: budget });
};

// update budget
const update_budget = async (budget: CreateOrUpdateBudgetOptions): Promise<Budget> => {
    return POSTFetcher("api/backend/finance/budget/update", { payload: budget });
};

const delete_budget = async (identifiers: Array<string>): Promise<void> => {
    const payload = identifiers.map((item) => ({ identifier: item }));
    return POSTFetcher("api/backend/finance/budget/delete", { payload: payload });
}

export interface QueryBudgetPayload {
    identifiers?: string[];
    page?: PageRequest;
}

const query_budget_by_options = async (options?: QueryBudgetPayload): Promise<PageResponse<Budget>> => {
    return POSTFetcher("api/backend/finance/budget/query", { payload: options ?? {} });
}

export interface CreateOrUpdateFlowOptions {
    identifier?: string; // 唯一标识
    title: string; // 标题
    user_idf?: string; // 用户唯一标识
    money_fen: number; // 金额
    root_budget_idf?: string; // 根预算唯一标识
    budget_idf?: string; // 预算唯一标识

    in_or_out: FlowInOrOut; // 账单类型
    flow_status: FlowStatus; // 账单状态
    pay_type: PayType; // 支付类型
    pay_detail?: string; // 支付详情

    counterparty?: string; // 交易对方
    order_id?: string; // 订单号

    product_info?: string; // 产品详情
    source_raw?: string; // 原始来源
    remark?: string; // 备注
    spend_at: Date | number; // 消费时间
}

const createFlow = async (flow: CreateOrUpdateFlowOptions): Promise<Flow> => {

    const round_int = Math.round(flow.money_fen);
    if (round_int !== flow.money_fen) {
        throw new Error("金额必须为整数");
    }
    flow.money_fen = round_int;
    flow.spend_at = dayjs(flow.spend_at).valueOf();
    return POSTFetcher("api/backend/finance/flow/add", { payload: flow });
};

export interface QueryFlowPayload {
    identifiers?: string[];
    budget_idf?: string;
    user_idf?: string;
    start_at?: number;
    end_at?: number;
    in_or_out?: FlowInOrOut;
    flow_status?: FlowStatus;
    pay_type?: PayType;
    counterparty?: string; // 交易对方
}

const query_flow_by_options = async (options?: QueryFlowPayload, page?: PageRequest): Promise<PageResponse<Flow>> => {
    return POSTFetcher("api/backend/finance/flow/query", { payload: options ?? {}, page: page });
}

const update_flow = async (flow: CreateOrUpdateFlowOptions): Promise<Flow> => {
    const round_int = Math.round(flow.money_fen);
    if (round_int !== flow.money_fen) {
        throw new Error("金额必须为整数");
    }
    flow.money_fen = round_int;
    flow.spend_at = dayjs(flow.spend_at).valueOf();
    return POSTFetcher("api/backend/finance/flow/update", { payload: flow });
}

const budget_fetcher = async (options?: QueryBudgetPayload, page?: PageRequest) => {
    options = { page: page, ...options }
    return query_budget_by_options(options);
}

const useBudgetList = (options?: QueryBudgetPayload, page?: PageRequest) => {
    const params = new URLSearchParams();
    if (options) {
        params.append("options", JSON.stringify(options));
    }
    if (page) {
        params.append("page", JSON.stringify(page));
    }

    return useSWR<PageResponse<Budget>>(`budget-list?${params.toString()}`, () => budget_fetcher(options, page));
}

const flow_fetcher = async (options?: QueryFlowPayload, page?: PageRequest) => {
    return query_flow_by_options(options, page);
}

const useFlowList = (options?: QueryFlowPayload, page?: PageRequest) => {
    const params = new URLSearchParams();
    if (options) {
        params.append("options", JSON.stringify(options));
    }
    if (page) {
        params.append("page", JSON.stringify(page));
    }
    const queryString = params.toString();
    return useSWR<PageResponse<Flow>>(`flow-list?${queryString}`, () => flow_fetcher(options, page), {});
}
export interface QueryBudgetPiePayload {
    budget_idfs?: string[];
    start_at?: number;
    end_at?: number;
}

const query_pin_info_by_options = async (options?: QueryBudgetPiePayload): Promise<BudgetWithMoney[]> => {
    return POSTFetcher("api/backend/finance/overview", { payload: options ?? {} });
}
const query_pie_info_fetcher = async (options?: QueryBudgetPiePayload) => {
    return query_pin_info_by_options(options);
}

const useBudgetPieInfo = (options?: QueryBudgetPiePayload) => {
    const params = new URLSearchParams();
    if (options) {
        params.append("options", JSON.stringify(options));
    }
    return useSWR<Array<BudgetWithMoney>>(`pie-info?${JSON.stringify(params)}`, () => query_pie_info_fetcher(options), {});
}

export { createBudget, update_budget, delete_budget, createFlow, update_flow, useBudgetList, useFlowList, useBudgetPieInfo };