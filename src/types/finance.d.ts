import { PageRequest } from ".";

export type CreateOrUpdateBudgetReq = {
  identifier?: string;
  title: string;
  parent_idf?: string;
  remark?: string;
};

export interface CreateOrUpdateFlowReq {
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

// finance
export interface Budget {
  identifier: string; // 唯一标识
  title: string;
  parent_idf?: string; // 父级唯一标识
  remark?: string;
  created_at: Date; // 创建时间
}

export enum FlowInOrOut {
  UNKONWN = "Unkonwn", // 未知
  IN = "In", // 收入
  OUT = "Out", // 支出
  IGNORE = "Ignore", // 不计收支
}

export enum FlowStatus {
  UNCHECKED = "UnChecked", // 未审核
  CHECKED = "Checked", // 已审核
  ARCHIVER = "Archiver", // 已归档
}

export enum PayType {
  UNKONWN = "Unkonwn", // 未知
  ALIPAY = "AliPay", // 支付宝
  WECHAT = "Wechat", // 微信
  CASH = "Cash", // 现金
  BANKCARD = "BankCard", // 银行卡
  CREDITCARD = "CreditCard", // 信用卡
}

export interface QueryBudgetPayload {
  identifiers?: string[];
  page: PageRequest;
}

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
  page: PageRequest;
}

export interface Flow {
  identifier: string; // 唯一标识
  title: string; // 标题
  user_idf: string; // 用户唯一标识
  in_or_out: FlowInOrOut; // 收入或支出
  money_fen: number; // 金额
  budget_idf: string; // 预算唯一标识

  flow_type: FlowInOrOut; // 账单类型
  flow_status: FlowStatus; // 账单状态

  pay_type: PayType; // 支付类型
  pay_detail: string; // 支付详情

  counterparty?: string; // 交易对方
  order_id?: string; // 订单号

  product_info: string; // 产品详情
  source_raw?: string; // 来源原始数据
  remark?: string; // 备注

  spend_at: Date; // 消费时间
}
